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
        const tokenResponse = await client.linkTokenCreate({
            user: process.env.PLAID_CLIENT_ID,
            client_name: "Plaid's Tiny Quickstart",
            language: "en",
            products: ["auth"],
            country_codes: ["US"],
            redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
        });

        return tokenResponse.data;
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
