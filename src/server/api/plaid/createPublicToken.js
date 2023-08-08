import plaidClient from "plaid";

export default async function handler(req, res) {
    try {
        const tokenResponse = await plaidClient.linkToCreate({
            user: { client_user_id: process.env.PLAID_CLIENT_ID },
            client_name: "Plaid's Tiny Quickstart",
            language: "en",
            products: ["auth", "transactions"],
            country_codes: ["US"],
            redirect_uri: process.env.PLAID_SANDBOX_REDIRECT_URI,
        });

        res.status(200).json(tokenResponse);
    } catch (error) {
        res.status(405).json(error);
    }
}
