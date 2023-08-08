import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { api } from "~/utils/api";
import {
    SignUpButton,
    SignInButton,
    useUser,
    SignOutButton,
} from "@clerk/nextjs";

export default function Home() {
    const user = useUser();

    const { data, isLoading } = api.accounts.getAll.useQuery();
    // const token = api.linkToken.createLinkToken.useQuery(user?.id);
    if (isLoading) return <div> Loading...</div>;
    if (!data) return <div> Something went wrong...</div>;
    return (
        <>
            <Head>
                <title>Create T3 App</title>
                <meta name="description" content="Generated by create-t3-app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen justify-center">
                <div className="md: bg-red-2xl h-full w-full border-x border-slate-200">
                    <div className="border-b border-slate-400 p-4 ">
                        {!user.isSignedIn && (
                            <div className="flex justify-center">
                                <SignInButton />
                            </div>
                        )}
                        {!!user.isSignedIn && (
                            <div className="flex justify-around">
                                <div className="flex">
                                    <img
                                        src={user.user.imageUrl}
                                        className="h-14 w-14 rounded-full"
                                    />{" "}
                                    {user.user.fullName}{" "}
                                </div>
                                <div>
                                    <SignOutButton />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col">
                        {!!user.isSignedIn &&
                            [...data]?.map((account) => (
                                <div
                                    key={account.id}
                                    className="border-b border-slate-400 p-8"
                                >
                                    {account.isoCurrencyCode}{" "}
                                </div>
                            ))}
                    </div>
                </div>
            </main>
        </>
    );
}

function AuthShowcase() {
    const { data: sessionData } = useSession();

    const { data: secretMessage } = api.accounts.getSecretMessage.useQuery(
        undefined, // no input
        { enabled: sessionData?.user !== undefined }
    );

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-center text-2xl text-white">
                {sessionData && (
                    <span>Logged in as {sessionData.user?.name}</span>
                )}
                {secretMessage && <span> - {secretMessage}</span>}
            </p>
            <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={
                    sessionData ? () => void signOut() : () => void signIn()
                }
            >
                {sessionData ? "Sign out" : "Sign in"}
            </button>
        </div>
    );
}
