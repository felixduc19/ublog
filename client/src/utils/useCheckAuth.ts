import { useRouter } from "next/router";
import { useEffect } from "react";

import { useMeQuery } from "../generated/graphql";

export const useCheckAuth = () => {
    const router = useRouter();

    const { data, loading } = useMeQuery();

    useEffect(() => {
        if (!loading) {
            if (
                data?.me &&
                (router.route === "/auth/login" ||
                    router.route === "/auth/register" ||
                    router.route === "/auth/forgot-password" ||
                    router.route === "/auth/change-password")
            ) {
                router.replace("/");
            }
        }
    }, [data, loading, router]);

    return { data, loading };
};
