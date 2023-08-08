import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";
const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
            "PLAID-SECRET": process.env.PLAID_SECRET,
        },
    },
});
const client = new PlaidApi(configuration);

export const linkTokenRouter = createTRPCRouter({
    createLinkToken: publicProcedure.query(async () => {
        const request = {
            user: { client_user_id: process.env.PLAID_CLIENT_ID },
            client_name: "Plaid's Tiny Quickstart",
            language: "en",
            products: process.env.PLAID_PRODUCTS,
            country_codes: process.env.PLAID_COUNTRY_CODES,
            redirect_uri: "localhost:3000",
        };
        const tokenResponse = await client.linkTokenCreate(request);

        return JSON.stringify(tokenResponse.data);
    }),

    exchangePublicToken: publicProcedure.query(async (publicToken: string) => {
        const exchangeResponse = await client.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const access_token = exchangeResponse.data.access_token;
        return access_token;
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
