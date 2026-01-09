// routes/Private.tsx
import { cookies } from "next/headers";
import React from "react";
import ReduxHydrator from "./ReduxHydrator";

function decodeJwt(token: string) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch {
        return null;
    }
}

export default async function ServerPrivate({ children }: { children: React.ReactNode }) {
    // ✅ Read cookie server-side
    const cookieStore = await cookies();
    const access_token = cookieStore.get("access_token")?.value;

    if (!access_token) return;

    // const payload = decodeJwt(access_token);
    // if (!payload || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    //     redirect("/");
    // }


    // const user = payload; 

    return (
        <>
            {/* ✅ Hydrate Redux store on client */}
            <ReduxHydrator token={access_token} />
            {children}
        </>
    );
}