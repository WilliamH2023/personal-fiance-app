import { RouterOutputs, api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";

export default function AccountViews() {
    type AccountWithUser = RouterOutputs["accounts"]["getAll"][number];
    const user = useUser();
    const { data, isLoading } = api.accounts.getAll.useQuery();
    if (isLoading) return <div> Loading...</div>;
    if (!data) return <div> Something went wrong...</div>;

    const AccountView = (props: AccountWithUser) => {
        const { id, name, type, available, isoCurrencyCode } = props;
        return (
            <div
                key={id}
                className="grid grid-flow-row-dense grid-cols-3 grid-rows-1 gap-3 border-b border-slate-400 p-4"
            >
                <span className="basis-1/8">{name}</span>
                <span className="basis-1/8">{type}</span>
                <span className="basis-1/2">
                    {available} {isoCurrencyCode}
                </span>
            </div>
        );
    };

    return (
        <>
            <div className="flex flex-col">
                {!!user.isSignedIn &&
                    [...data]?.map((account) => (
                        <AccountView {...account} key={account.id} />
                    ))}
            </div>
        </>
    );
}
