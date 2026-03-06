"use client";

import { useAppDispatch } from "@/hooks/hook";
import { useGetAgeGateUuidMutation, useVerifyAgeGateMutation } from "@/services/authApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { Button } from "@mui/material";
import { useCallback } from "react";

export default function AgeGate() {

    const [getAgeGateUuid, { isLoading }] = useGetAgeGateUuidMutation();
    const [verifyAgeGate] = useVerifyAgeGateMutation();
    const dispatch = useAppDispatch();
    const handleSuccess = useCallback(async (uuid: string) => {
        try {
            await verifyAgeGate({ age_verify_uuid: uuid }).unwrap();
            window.location.reload();
        } catch (err) {
            console.error("[AgeGate] Backend verification failed:", err);
        }
    }, [verifyAgeGate]);

    const openAgeGate = async () => {
        try {
            const res = await getAgeGateUuid().unwrap();

            const uuid = res?.data?.age_verify_uuid;
            const verified = res?.data?.is_age_verified;

            if (!uuid || verified) return;

            (window as any).AgeCheckerConfig = {
                key: process.env.NEXT_PUBLIC_AGE_CHECKER_KEY,
                mode: "manual",
                autoload: true,
                show_close: true,
                onready: () => {
                    (window as any).AgeCheckerAPI.show(uuid);
                },
                onstatuschanged: (verification: { uuid: string; status: string }) => {
                    if (verification.status === "accepted") {
                        handleSuccess(verification.uuid);
                    }
                },
                onpagehide: () => {
                    (window as any).AgeCheckerAPI.close();
                }
            };

            const existing = document.querySelector('script[src*="agechecker.net"]');

            if (existing) {
                (window as any).AgeCheckerAPI?.show(uuid);
                return;
            }

            const script = document.createElement("script");
            script.src = "https://cdn.agechecker.net/static/popup/v1/popup.js";
            script.crossOrigin = "anonymous";

            script.onerror = () => {
                window.location.href = "https://agechecker.net/loaderror";
            };

            document.head.insertBefore(script, document.head.firstChild);

        } catch (err: any) {
            dispatch(showToast({
                message: err?.data?.message || "Failed to initiate age verification. Please try again.",
                variant: ToastVariant.ERROR
            }))
        }
    };

    return (
        <Button
            variant="contained"
            color="primary"
            fullWidth
            className="col-span-1 md:col-span-2 mt-2"
            onClick={openAgeGate}
            disabled={isLoading}
        >
            {isLoading ? "Loading..." : "Verify Account Now"}
        </Button>
    );
}