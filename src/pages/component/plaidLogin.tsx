import { NextPage } from "next";
import React, { useState, useEffect, useCallback } from "react";

// import {
//     // usePlaidLink,
//     // PlaidLinkOptions,
//     // PlaidLinkOnSuccess,
//     PlaidLink,
// } from "react-plaid-link";
// import fetchSwal from "../../utils/fetchSwal";

// interface PLinkProps {}

// const PLink: NextPage<PLinkProps> = ({}) => {
//     const [transactions, setTransactions] = useState(Object);

//     function handleOnSuccess(public_token: any, metadata: any) {
//         // send token to client server
//         fetchSwal
//             .post("/api/plaid", {
//                 public_token: public_token,
//                 metadata: metadata,
//             })
//             .then((res) => {
//                 if (res.ok !== false) {
//                     setTransactions({ transactions: res.transactions });
//                     //redirectTo('/');
//                 }
//             });
//     }

//     function handleOnExit() {
//         // handle the case when your user exits Link
//         // For the sake of this tutorial, we're not going to be doing anything here.
//     }

//     function handleClick(res: any) {
//         console.log("transactions:", transactions);
//     }
//     return (
//         <div>
//             <PlaidLink
//                 clientName="React Plaid Setup"
//                 env="sandbox"
//                 product={["auth", "transactions"]}
//                 publicKey={process.env.PLAID_PUBLIC_KEY!}
//                 onExit={handleOnExit}
//                 onSuccess={handleOnSuccess}
//                 style={{}}
//                 className="mt-5 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-700"
//             >
//                 Connect your bank!
//             </PlaidLink>
//             <div>
//                 <button
//                     onClick={handleClick}
//                     className="mt-5 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
//                 >
//                     View Transactions
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default PLink;

import {
    usePlaidLink,
    PlaidLinkOnSuccess,
    PlaidLinkOnEvent,
    PlaidLinkOnExit,
    PlaidLinkOptions,
} from "react-plaid-link";
import { api } from "~/utils/api";

const PlaidLinkWithOAuth = () => {
    const [token, setToken] = useState<string | null>(null);
    const isOAuthRedirect = window.location.href.includes("?oauth_state_id=");
    const { data, isLoading } = api.linkToken.createLinkToken.useQuery();
    // generate a link_token when component mounts
    React.useEffect(() => {
        // do not generate a new token if page is handling an OAuth redirect.
        // instead setLinkToken to previously generated token from localStorage
        // https://plaid.com/docs/link/oauth/#reinitializing-link
        if (isOAuthRedirect) {
            setToken(localStorage.getItem("link_token"));
            return;
        }
        setToken(data);
    }, [data]);

    const onSuccess = useCallback<PlaidLinkOnSuccess>(
        (publicToken, metadata) => {
            // send public_token to your server
            // https://plaid.com/docs/api/tokens/#token-exchange-flow
            console.log(publicToken, metadata);
        },
        []
    );
    const onEvent = useCallback<PlaidLinkOnEvent>((eventName, metadata) => {
        // log onEvent callbacks from Link
        // https://plaid.com/docs/link/web/#onevent
        console.log(eventName, metadata);
    }, []);
    const onExit = useCallback<PlaidLinkOnExit>((error, metadata) => {
        // log onExit callbacks from Link, handle errors
        // https://plaid.com/docs/link/web/#onexit
        console.log(error, metadata);
    }, []);

    const config: PlaidLinkOptions = {
        // token must be the same token used for the first initialization of Link
        token,
        onSuccess,
        onEvent,
        onExit,
    };
    if (isOAuthRedirect) {
        // receivedRedirectUri must include the query params
        config.receivedRedirectUri = window.location.href;
    }

    const {
        open,
        ready,
        // error,
        // exit
    } = usePlaidLink(config);

    React.useEffect(() => {
        // If OAuth redirect, instantly open link when it is ready instead of
        // making user click the button
        if (isOAuthRedirect && ready) {
            open();
        }
    }, [ready, open, isOAuthRedirect]);

    // No need to render a button on OAuth redirect as link opens instantly
    return isOAuthRedirect ? (
        <></>
    ) : (
        <button onClick={() => open()} disabled={!ready}>
            Connect a bank account
        </button>
    );
};

export default PlaidLinkWithOAuth;
