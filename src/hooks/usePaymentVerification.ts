"use client";

import { useVerifyPaymentMutation } from "@/services/transaction";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAppDispatch } from "./hook";

type VerificationType = "success" | "error" | "expired";

type Options = {
    type: VerificationType;
};

export function usePaymentVerification({ type }: Options) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const paymentId = searchParams.get("ipd");
    const dispatch = useAppDispatch();

    const [verifyPayment] = useVerifyPaymentMutation();

    useEffect(() => {
        if (!paymentId) return;

        const runVerification = async () => {
            try {
                await verifyPayment({
                    paymentId,
                    type,
                }).unwrap();
            } catch (err: any) {
                dispatch(
                    showToast({
                        message: err?.data?.message || "Payment verification failed. Please contact support.",
                        variant: ToastVariant.ERROR,
                    })
                )
            }
        };

        runVerification();
    }, [paymentId, type, router, verifyPayment]);

    return {
        paymentId,
        isVerifying: !!paymentId,
    };
}
