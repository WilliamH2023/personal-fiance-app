import { clerkClient, useUser } from "@clerk/nextjs";
import { z } from "zod";
import {
    createTRPCRouter,
    publicProcedure,
    protectedProcedure,
} from "~/server/api/trpc";

export const accountsRouter = createTRPCRouter({
    getAll: publicProcedure.query(async ({ ctx }) => {
        const accountInfo = await ctx.prisma.account.findMany({
            // where: { userId: user.id },
        });

        return accountInfo;
    }),

    getSecretMessage: protectedProcedure.query(() => {
        return "you can now see this secret message!";
    }),
});
