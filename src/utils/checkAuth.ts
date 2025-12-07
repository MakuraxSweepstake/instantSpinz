// utils/CheckAuth.ts
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

export function CheckAuth() {
    let token: string | null = null;

    if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token") || Cookies.get("access_token") || null;
    }

    if (!token) return false;
    if (isTokenExpired(token)) return false;

    return true;
}
