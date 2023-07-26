import { accountsRouter } from "~/server/api/routers/accounts";
//import { linkTokenRouter } from "~/server/api/routers/linkToken";
import { createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    accounts: accountsRouter,
    //linkToken: linkTokenRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
