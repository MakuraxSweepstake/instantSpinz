"use client";
import GlassWrapper from '@/components/molecules/GlassWrapper';
import { usePaymentVerification } from '@/hooks/usePaymentVerification';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';


export default function PaymentError() {
    const { slug } = useParams<{ slug: string }>();

    usePaymentVerification({
        type: "expired",
    });

    return (
        <GlassWrapper className="max-w-[520px] mx-auto flex flex-col gap-3 items-center text-center p-6">
            <Image
                src="/assets/images/verify-email.png"
                alt="Payment Success"
                width={180}
                height={140}
            />
            <h1 className="text-[24px] lg:text-[32px] leading-[120%] font-bold mb-4 text-red-500">
                Payment Link Expired ❌
            </h1>
            <p className="text-[14px] leading-[150%] font-normal lg:text-[16px] mb-4">
                We couldn’t complete your payment at this time.
                This could be due to a network issue, insufficient balance, or the payment was cancelled.
            </p>

            <Link
                href={`/buy-coins/${slug}`}
                className="ss-btn bg-primary-grad"
            >
                Try Again
            </Link>
        </GlassWrapper>
    )
}
