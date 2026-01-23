"use client";

import GlassWrapper from "@/components/molecules/GlassWrapper";
import { usePaymentVerification } from "@/hooks/usePaymentVerification";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PaymentSuccess() {
    const { slug } = useParams<{ slug: string }>();

    usePaymentVerification({
        type: "success",
    });

    return (
        <GlassWrapper className="max-w-[520px] mx-auto flex flex-col gap-3 items-center text-center p-6">
            <Image
                src="/assets/images/verify-email.png"
                alt="Payment Success"
                width={180}
                height={140}
            />

            <h1 className="text-[24px] lg:text-[32px] font-bold text-green-500">
                Payment Successful 🎉
            </h1>

            <p className="text-[14px] lg:text-[16px]">
                Your payment was processed successfully.
            </p>

            <Link
                href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/exclusive-games/${slug}`}
                className="ss-btn bg-primary-grad"
            >
                View Game Detail
            </Link>
        </GlassWrapper>
    );
}
