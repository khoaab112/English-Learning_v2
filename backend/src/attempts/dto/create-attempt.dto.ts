export class CreateAttemptDto {
    lessonId: number;
    score: number;
    userText: string;
    feedback?: any;
    userId: number; // Injected by controller
}
