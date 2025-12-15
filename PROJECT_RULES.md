# Project Rules & Guidelines

## 1. Configuration & Security
**Rule:** Always use environment variables (`.env`) for configuration. Never hardcode sensitive values or environment-specific settings in the codebase.

**Implementation:**
-   Check if a value (API key, Database Credential, Secret, Host/Port) might change between environments (Dev, Staging, Prod). If yes, put it in `.env`.
-   Use `ConfigService` in NestJS to access these values.
-   **Always validate** the existence of these variables at startup. Throw an error if a required variable is missing (Fail Fast).
-   **Do not use insecure fallbacks** (e.g., `|| 'secret'`) in the code.

**Example (Good):**
```typescript
const host = configService.get<string>('DB_HOST');
if (!host) throw new Error('DB_HOST is missing');
```

**Example (Bad):**
```typescript
const host = configService.get<string>('DB_HOST') || 'localhost';
```

## 2. Environment Files
-   Maintain a `.env.example` file with all required keys (but dummy values).
-   Never commit `.env` to version control (ensure it is in `.gitignore`).
