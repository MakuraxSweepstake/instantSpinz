"use client";

import GlassWrapper from "@/components/molecules/GlassWrapper";
import { useAppDispatch } from "@/hooks/hook";
import { PATH } from "@/routes/PATH";
import { useAssureFailMutation } from "@/services/authApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { Button } from "@mui/material";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function AssureErrorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useAppDispatch();

    const id = searchParams.get("user_id");
    const hash = searchParams.get("hash");

    const [assureFail, { isLoading }] = useAssureFailMutation();

    useEffect(() => {
        const processFailure = async () => {
            if (!id || !hash) {
                dispatch(
                    showToast({
                        message: "Invalid verification link",
                        variant: ToastVariant.ERROR,
                        autoTime: true,
                    })
                );
                return;
            }

            try {
                await assureFail({ id, hash }).unwrap();

                dispatch(
                    showToast({
                        message: "Verification failed. Please register again.",
                        variant: ToastVariant.ERROR,
                        autoTime: true,
                    })
                );

                router.replace(PATH.AUTH.REGISTER.ROOT);
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something went wrong",
                        variant: ToastVariant.ERROR,
                        autoTime: true,
                    })
                );
            }
        };

        processFailure();
    }, [id, hash, dispatch, router, assureFail]);

    return (
        <GlassWrapper className="max-w-[520px] mx-auto flex flex-col gap-4 items-center text-center p-6 mt-10">
            <Image
                src="/assets/images/error.png"
                alt="error"
                width={150}
                height={150}
            />

            <h1 className="text-[24px] lg:text-[32px] font-bold leading-[120%]">
                Something went wrong
            </h1>

            <p className="text-[14px] lg:text-[16px] leading-[150%] text-gray-300">
                We could not verify your identity. You may need to register again to continue.
            </p>

            <Button
                fullWidth
                size="large"
                variant="contained"
                color="secondary"
                onClick={() => router.replace(PATH.AUTH.REGISTER.ROOT)}
            >
                {isLoading ? "Processing..." : "Go to Register"}
            </Button>
        </GlassWrapper>
    );
}

export default function AssureError() {
    return (
        <Suspense fallback={
            <GlassWrapper className="max-w-[520px] mx-auto flex flex-col gap-4 items-center text-center p-6 mt-10">
                <div className="animate-pulse">Loading...</div>
            </GlassWrapper>
        }>
            <AssureErrorContent />
        </Suspense>
    );
}