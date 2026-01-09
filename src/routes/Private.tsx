"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { clearTokens, setTokens } from "@/slice/authSlice";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Cookies from "js-cookie";

function isTokenExpired(token: string): boolean {
    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const exp = payload.exp;
        if (!exp) return true;
        const now = Math.floor(Date.now() / 1000);
        return exp < now;
    } catch (error) {
        console.error("Failed to decode token:", error);
        return true;
    }
}

export default function Private({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const user = useAppSelector((state) => state.auth.user);
    const token = useAppSelector((state) => state.auth.access_token);

    useEffect(() => {
        let accessToken = token || Cookies.get("access_token");

        if (!accessToken || isTokenExpired(accessToken)) {
            dispatch(clearTokens());
            // router.replace("/");
            return;
        }

        // ✅ optional: if Redux was empty, rehydrate it from cookie
        if (!token && accessToken) {
            dispatch(setTokens({ access_token: accessToken, user: user || null }));
        }

        // if (!user) {
        //     router.replace("/");
        // }
    }, [token, user, dispatch, router]);

    if (!user) return null;

    return <>{children}</>;
}


