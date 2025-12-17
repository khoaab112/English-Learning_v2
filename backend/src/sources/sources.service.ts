import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

export interface ExternalWord {
    word: string;
    ipa?: string;
    meaning?: string;
    type?: string;
    example?: string;
    audioUrl?: string;
    imageUrl?: string;
    source: string;
    level?: string;
    exampleMeaning?: string; // Added Example Meaning
}

@Injectable()
export class SourcesService {

    private readonly collections = [
        { id: 'api-free-dict', name: '🌐 Free Dictionary API (Live)', type: 'API' },
        { id: 'api-datamuse', name: '🔍 Find by Topic (Datamuse)', type: 'API' }
    ];

    getSources() {
        return this.collections;
    }

    async search(sourceId: string, query: string): Promise<ExternalWord[]> {
        if (sourceId === 'api-free-dict') {
            return this.searchFreeDictionary(query);
        }
        return [];
    }

    // Check if Source Supports Bulk
    supportsBulk(sourceId: string): boolean {
        return sourceId === 'api-datamuse';
    }

    async generateBulk(sourceId: string, count: number, level?: string, topic?: string): Promise<ExternalWord[]> {
        if (!this.supportsBulk(sourceId)) return [];

        if (sourceId === 'api-datamuse') {
            return this.fetchFromDatamuse(topic || 'english', count);
        }

        return [];
    }

    private async searchFreeDictionary(word: string): Promise<ExternalWord[]> {
        if (!word) return [];
        try {
            const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            const { data } = await axios.get(url);

            const results: ExternalWord[] = [];

            for (const entry of data) {
                const firstMeaning = entry.meanings[0];
                const firstDef = firstMeaning?.definitions[0];

                let audio = '';
                for (const phon of entry.phonetics) {
                    if (phon.audio) { audio = phon.audio; break; }
                }

                let ipa = entry.phonetic;
                if (!ipa && entry.phonetics) {
                    const textPhon = entry.phonetics.find((p: any) => p.text);
                    if (textPhon) ipa = textPhon.text;
                }

                results.push({
                    word: entry.word,
                    ipa: ipa || '',
                    type: firstMeaning?.partOfSpeech || 'n',
                    meaning: '',
                    example: firstDef?.example || '',
                    audioUrl: audio,
                    source: 'api-free-dict'
                });
            }
            return results;

        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
                return [];
            }
            console.error("Free Dictionary API Error", error);
            throw new HttpException("Error fetching from external API", HttpStatus.BAD_GATEWAY);
        }
    }

    private async translateText(text: string): Promise<string> {
        if (!text) return '';
        try {
            // Using Google Translate free endpoint (unofficial)
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=${encodeURIComponent(text)}`;
            const { data } = await axios.get(url);
            // Response format used by this endpoint: [[["Translated info", "Original", ...], ...], ...]
            if (data && data[0] && data[0][0] && data[0][0][0]) {
                return data.flat(2)[0]; // robust retrieval
            }
            return text;
        } catch (e) {
            return text; // Fallback to original
        }
    }

    private async enrichWithFreeDict(word: string): Promise<Partial<ExternalWord>> {
        try {
            const results = await this.searchFreeDictionary(word);
            if (results && results.length > 0) {
                return results[0];
            }
        } catch (e) {
            console.log(`[enrichWithFreeDict] Failed for ${word}:`, e instanceof Error ? e.message : e); // Added log
        }
        return {};
    }

    private cleanIPA(ipa: string): string {
        if (!ipa) return '';
        let cleaned = ipa.replace(/ɹ/g, 'r');
        if (!cleaned.startsWith('/') && !cleaned.startsWith('[')) {
            cleaned = `/${cleaned}/`;
        }
        return cleaned;
    }

    private sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async fetchFromDatamuse(topic: string, count: number): Promise<ExternalWord[]> {
        try {
            // "ml" stands for "means like" or "related to"
            const url = `https://api.datamuse.com/words?ml=${encodeURIComponent(topic)}&max=${count}&md=dp&ipa=1`;
            const { data } = await axios.get(url);

            const results: ExternalWord[] = [];

            for (const item of data) {
                // Throttle to avoid rate limits
                await this.sleep(1200);

                // ... Parsing logic ...
                // Parse definition usually in format "n\tThe definition text"
                let defText = '';
                let type = 'n';
                if (item.defs && item.defs.length > 0) {
                    const parts = item.defs[0].split('\t');
                    if (parts.length >= 2) {
                        type = parts[0];
                        defText = parts[1];
                    } else {
                        defText = item.defs[0];
                    }
                }

                // Map POS tags from Datamuse (n, v, adj, adv) to our standard
                if (item.tags && item.tags.includes('adj')) type = 'adj';
                else if (item.tags && item.tags.includes('v')) type = 'v';
                else if (item.tags && item.tags.includes('adv')) type = 'adv';
                else if (item.tags && item.tags.includes('n')) type = 'n';

                let ipa = '';
                if (item.tags) {
                    const ipaTag = item.tags.find((t: string) => t.startsWith('ipa_phon:'));
                    if (ipaTag) {
                        ipa = ipaTag.replace('ipa_phon:', '');
                    }
                }

                // Translate Meaning
                const translatedWord = await this.translateText(item.word);
                let finalMeaning = translatedWord;

                // --- DEEP ENRICHMENT ---
                const richData = await this.enrichWithFreeDict(item.word);
                if (richData.ipa) ipa = richData.ipa;

                // Customize IPA display (sanitize)
                ipa = this.cleanIPA(ipa);

                results.push({
                    word: item.word,
                    ipa: ipa,
                    type: type,
                    meaning: finalMeaning,
                    example: defText,
                    exampleMeaning: await this.translateText(defText),
                    source: 'api-datamuse',
                    // Use Rich Audio if available, else TTS
                    audioUrl: richData.audioUrl || `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${item.word}&tl=en`,
                    imageUrl: `https://loremflickr.com/320/240/${encodeURIComponent(item.word)}?random=${Math.random()}`
                });


            }

            return results;
        } catch (error) {
            console.error("Datamuse API Error", error);
            // Return empty list on error so UI handles it gracefully or empty
            return [];
        }
    }
}
