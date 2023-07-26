import { NextPage } from "next";
import React, { useState, useEffect } from "react";

import {
    usePlaidLink,
    PlaidLinkOptions,
    PlaidLinkOnSuccess,
} from "react-plaid-link";
import fetchSwal from "../../utils/plaid";

interface PLinkProps {}

const PLink: NextPage<PLinkProps> = ({}) => {
    const [transactions, setTransactions] = useState(Object);

    const config: PlaidLinkOptions = {
        onSuccess: (public_token, metadata) =>
            function handleOnSuccess(public_token: any, metadata: any) {
                // send token to client server
                fetchSwal
                    .post("/api/plaid", {
                        public_token: public_token,
                        metadata: metadata,
                    })
                    .then((res) => {
                        if (res.ok !== false) {
                            setTransactions({ transactions: res.transactions });
                            //redirectTo('/');
                        }
                    });
            },
        onExit: (err, metadata) =>
            function handleOnExit() {
                // handle the case when your user exits Link
                // For the sake of this tutorial, we're not going to be doing anything here.
            },
        onEvent: (eventName, metadata) =>
            function handleClick(res: any) {
                console.log("transactions:", transactions);
            },
        token: "GENERATED_LINK_TOKEN",
        //required for OAuth; if not using OAuth, set to null or omit:
        receivedRedirectUri: window.location.href,
    };
    const { open, exit, ready } = usePlaidLink(config);

    return (
        <button onClick={() => open()} disabled={!ready}>
            <strong>Link account</strong>
        </button>
    );
};

export default PLink;

// import Router from "next/router";
// import { useState, useEffect, useCallback } from "react";
// import { usePlaidLink } from "react-plaid-link";
// import { api } from "~/utils/api";

// export default function PlaidLogin() {
//     const [token, setToken] = useState("");

//     const { isError, data, error } = api.linkToken.createLinkToken.useQuery();
//     if (isError)
//         console.log(
//             "🚀 ~ file: plaidLogin.tsx:14 ~ createLinkToken ~ isError:",
//             isError,
//             error
//         );
//     const linkToken: string = data !== undefined ? data : "";
//     useEffect(() => {
//         setToken(linkToken);
//     }, [linkToken]);

//     const { isError, data, error } = api.linkToken.exchangePublicToken.useQuery();
//     const onSuccess = useCallback(async () => {
//         await fetch("/api/exchange-public-token", {
//             method: "POST",s
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             body: JSON.stringify({ public_token: publicToken }),
//         });
//         Router.push("/dash");
//     }, []);

//     const { open, ready, exit, error } = usePlaidLink({
//         token,
//         onSuccess,
//     });

//     return (
//         <button onClick={() => open()} disabled={!ready}>
//             <strong>Link account</strong>
//         </button>
//     );
// }
