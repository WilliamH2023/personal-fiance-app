export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string;
            NEXTAUTH_SECRET: string;
            NEXTAUTH_URL: string;
            PLAID_CLIENT_ID: string;
            PLAID_SECRET: string;
            PLAID_ENV: string;
            PLAID_PRODUCTS: Products[];
            PLAID_COUNTRY_CODES: CountryCode[];
            NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: string;
            CLERK_SECRET_KEY: string;
        }
    }
}
