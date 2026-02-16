"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { useSubmitMassPayPaymentFieldsMutation, useWithdrawlMutation } from "@/services/transaction";
import { useGetVerificationLinkMutation, useVerifyUserForWithdrawlMutation } from "@/services/userApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { openPasswordDialog } from "@/slice/updatePasswordSlice";
import { GameResponseProps } from "@/types/game";
import { MasspayPaymentFields } from "@/types/transaction";
import { Button, OutlinedInput } from "@mui/material";
import { CardPos } from "@wandersonalwes/iconsax-react";
import { useFormik } from "formik";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import * as Yup from "yup";
import WithdrawlModal from "./WithdrawlModal";

// Conditional validation schema based on type
const validationSchema = Yup.object({
    withdrawl_amounts: Yup.object().test(
        "min-amount",
        "Amount must be greater than $2",
        (value) => {
            if (!value) return true;
            return Object.values(value).every(
                (v) => v === "" || Number(v) >= 2
            );
        }
    ),
    type: Yup.string().oneOf(["auxvault", "tryspeed", "masspay"]).required(),
    photoid_number: Yup.string().when("type", {
        is: "tryspeed",
        then: (schema) => schema.required("SSN is required"),
        otherwise: (schema) => schema.notRequired(),
    }),

    // Required for auxvault
    customer_name: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Customer name is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    customer_email: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.email("Invalid email").required("Email is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    phone_number: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Phone number is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    postal_code: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Postal code is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    card_number: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Card number is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    cvv: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("CVV is required").matches(/^\d{3,4}$/, "Invalid CVV"),
        otherwise: (schema) => schema.notRequired(),
    }),
    expiry_date: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Expiry date is required, without slash"),
        otherwise: (schema) => schema.notRequired(),
    }),
    billing_address: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Billing address is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    billing_city: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Billing city is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    billing_state: Yup.string().when("type", {
        is: "auxvault",
        then: (schema) => schema.required("Billing state is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

export type WithdrawlFormValues = {
    game_provider: string;
    withdrawl_amounts: Record<string, number | "">;
    wallet_address: string;
    photoid_number: string;
    type: "auxvault" | "tryspeed" | "masspay";
    customer_name: string;
    customer_email: string;
    phone_number: string;
    postal_code: string;
    card_number: string;
    cvv: string;
    expiry_date: string;
    billing_address: string;
    billing_city: string;
    billing_state: string;
    masspay_type: string;
    payment_fields: MasspayPaymentFields[];
};


export const validateDynamicField = (
    field: MasspayPaymentFields,
    value?: string
): string | undefined => {
    if (!value || value.trim() === "") {
        return `${field.label} is required`;
    }

    if (field.validation && field.input_type !== "options") {
        try {
            const regex = new RegExp(field.validation, "u");
            if (!regex.test(value)) {
                return `Invalid ${field.label}`;
            }
        } catch {
            return `Invalid ${field.label}`;
        }
    }

    return undefined;
};

export default function WithdrawlPage({
    games,
    coins,
}: {
    games: GameResponseProps;
    coins: any;
}) {
    const [open, setOpen] = React.useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const gameInfo = coins?.data?.game_information || {};
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [withdrawMoney, { isLoading: withdrawing }] = useWithdrawlMutation();
    const [verifyUserForWithdrawl, { isLoading: verifying }] = useGetVerificationLinkMutation();
    const [verifyUser] = useVerifyUserForWithdrawlMutation();

    const [withdrawMoneyWithMasspay, { isLoading }] = useSubmitMassPayPaymentFieldsMutation();

    const formik = useFormik<WithdrawlFormValues>({
        initialValues: {
            game_provider: "",
            withdrawl_amounts: {},
            wallet_address: user?.wallet_address || "",
            photoid_number: "",
            type: "masspay",
            customer_name: user?.name || "",
            customer_email: user?.email || "",
            phone_number: user?.phone || "",
            postal_code: "",
            card_number: "",
            cvv: "",
            expiry_date: "",
            billing_address: user?.address || "",
            billing_city: user?.city || "",
            billing_state: user?.pob || "",
            masspay_type: "",
            payment_fields: []
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const amount = values.withdrawl_amounts[values.game_provider];
                const basePayload = {
                    wallet: values.wallet_address,
                    amount: Number(amount),
                    game_provider: values.game_provider,
                };

                const payload: any = values.type === "tryspeed"
                    ? {
                        ...basePayload,
                        photoid_number: values.photoid_number,
                        type: values.type,

                    }
                    : values.type === "auxvault" ? {
                        ...basePayload,
                        customer_name: values.customer_name,
                        customer_email: values.customer_email,
                        phone_number: values.phone_number,
                        postal_code: values.postal_code,
                        card_number: values.card_number,
                        cvv: values.cvv,
                        expiry_date: values.expiry_date,
                        billing_address: values.billing_address,
                        billing_city: values.billing_city,
                        billing_state: values.billing_state,
                        type: values.type,
                    } : {
                        ...basePayload,
                        type: values.masspay_type
                    };

                const fieldErrors: Record<string, string> = {};
                let hasErrors = false;

                values.payment_fields.forEach((field) => {
                    const error = validateDynamicField(field, field.value);
                    if (error) {
                        fieldErrors[field.token] = error;
                        hasErrors = true;
                    }
                });

                if (hasErrors) {
                    formik.setErrors({
                        ...formik.errors,
                        payment_fields: fieldErrors as any
                    });

                    dispatch(
                        showToast({
                            message: "Please fill in all required fields correctly",
                            variant: ToastVariant.ERROR,
                        })
                    );
                    return;
                }


                if (values.type === "masspay" && formik.values.payment_fields.length > 0) {
                    payload.values = formik.values.payment_fields;
                    payload.type = formik.values.masspay_type
                }
                let response = null;

                if (values.type === "masspay") {
                    response = await withdrawMoneyWithMasspay({ body: payload, token: values.masspay_type }).unwrap();
                }
                else {
                    response = await withdrawMoney(payload).unwrap();
                }
                // window.open(response?.data?.redirect_url);
                setOpen(false);
                dispatch(
                    showToast({
                        message: response?.message || "Withdraw request submitted successfully!",
                        variant: ToastVariant.SUCCESS,
                    })
                );
                formik.resetForm();
            } catch (e: any) {
                console.error("Withdrawal error:", e);
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something went wrong",
                        variant: ToastVariant.ERROR,
                    })
                );
            }
        },
    });

    const handleVerify = async () => {
        try {
            const response = await verifyUserForWithdrawl().unwrap();
            const url = response?.data?.data;

            if (url) {
                window.open(url, "_blank", "noopener,noreferrer");
            }
            dispatch(
                showToast({
                    message: response?.message || "Verified successfully!",
                    variant: ToastVariant.SUCCESS,
                    autoTime: true
                })
            );
        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Couldn't Verify.",
                    variant: ToastVariant.ERROR,
                })
            );
        }
    }


    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) return;

        const verify = async () => {
            try {
                const response = await verifyUser({ token }).unwrap();

                dispatch(
                    showToast({
                        message: response?.message || "Verified successfully!",
                        variant: ToastVariant.SUCCESS,
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Couldn't Verify.",
                        variant: ToastVariant.ERROR,
                    })
                );
            } finally {
                router.replace("/withdrawl");
            }
        };

        verify();
    }, [searchParams, verifyUser, dispatch, router]);



    const handleWithdrawlChange = (provider: string, value: string) => {
        const parsedValue = value === "" ? "" : Number(value);
        formik.setFieldValue(
            `withdrawl_amounts.${provider}`,
            isNaN(parsedValue as number) ? "" : parsedValue
        );
    };

    const handleWithdrawClick = (balance: number, provider: string) => {
        if (balance < 2) {
            dispatch(
                showToast({
                    message: "Insufficient balance to withdraw (Min $2 required)",
                    variant: ToastVariant.ERROR,
                })
            );
            return;
        }
        formik.setFieldValue("game_provider", provider);
        setOpen(true);
    };

    const filteredGames = games?.data?.data?.filter(
        (game) => game.provider.toLowerCase() !== "goldcoincity"
    ) || [];

    return (
        <section className="withdrawl__root">
            <div className="section__title mb-4 lg:mb-8 max-w-[520px]">
                <h1 className="mb-2 text-[24px] lg:text-[32px]">
                    Withdraw Coins
                </h1>
                <p className="text-[11px] lg:text-[13px]">
                    To start playing and cashing out your winnings, you'll
                    need a crypto wallet to purchase E-Credits and receive
                    payouts. Don't worry—it's quick and easy!
                </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4">
                    {filteredGames.map((game) => {
                        const info = gameInfo[game.provider.toLowerCase()] || {
                            available: 0,
                            type: "sc",
                            has_changed_password: false,
                        };

                        const currentAmount = formik.values.withdrawl_amounts[game.provider] ?? "";
                        const hasError = Boolean(
                            formik.touched.withdrawl_amounts?.[game.provider] &&
                            (formik.errors.withdrawl_amounts as any)?.[game.provider]
                        );

                        return (
                            <div
                                key={game.id}
                                className="withdrawl__card p-4 lg:py-6 lg:px-5 rounded-[24px] grid gap-4 lg:grid-cols-3 items-center"
                                style={{
                                    background:
                                        "linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), rgba(255, 255, 255, 0.10)",
                                }}
                            >
                                {/* Game Info */}
                                <div className="flex gap-4 items-center mb-4 lg:col-span-1">
                                    <Image
                                        src={game.thumbnail || "/assets/images/fallback.png"}
                                        alt={game.name}
                                        width={66}
                                        height={66}
                                        className="rounded-full aspect-square"
                                    />
                                    <div className="game-content">
                                        <strong className="text-[16px] text-white block mb-2">
                                            {game.name}
                                        </strong>
                                        <span className="text-[12px] font-[600]">
                                            {info.available}
                                        </span>
                                    </div>
                                </div>

                                {/* Input Field */}
                                <div className="lg:col-span-1 lg:text-center">
                                    <label
                                        htmlFor={`withdrawl-${game.provider}`}
                                        className="text-[12px] block mb-1"
                                    >
                                        Enter your coins
                                    </label>
                                    <div className="value__field relative">
                                        <OutlinedInput
                                            id={`withdrawl-${game.provider}`}
                                            type="number"
                                            value={currentAmount}
                                            onChange={(e) =>
                                                handleWithdrawlChange(
                                                    game.provider,
                                                    e.target.value
                                                )
                                            }
                                            onBlur={() => formik.setFieldTouched(`withdrawl_amounts.${game.provider}`)}
                                            inputProps={{ min: 2, step: 0.01 }}
                                            placeholder="5.0"
                                            error={hasError}
                                        />
                                        <Button
                                            className="!p-0 !text-white"
                                            sx={{
                                                position: "absolute",
                                                top: "50%",
                                                transform: "translateY(-50%)",
                                                right: 0,
                                                maxWidth: "fit-content",
                                            }}
                                            onClick={() =>
                                                handleWithdrawlChange(
                                                    game.provider,
                                                    info.available.toString()
                                                )
                                            }
                                            type="button"
                                        >
                                            | &nbsp;&nbsp;All
                                        </Button>
                                    </div>
                                    {hasError && (
                                        <span className="text-red-400 text-xs">
                                            {(formik.errors.withdrawl_amounts as any)?.[game.provider]}
                                        </span>
                                    )}
                                    <span className="text-[8px] lg:text-[10px]">
                                        Min $2.0
                                    </span>
                                </div>

                                {/* Withdraw Button */}
                                <div className="lg:col-span-1 text-end flex justify-end gap-2">
                                    <Button variant="contained"
                                        disabled={info?.can_withdraw}
                                        onClick={() => handleVerify()}
                                        color="primary" className="md:!max-w-fit ">{verifying ? "Verifying User" : "Verify First"}</Button>
                                    <Button
                                        disabled={!info?.can_withdraw}
                                        variant="contained"
                                        color="secondary"
                                        className="md:!max-w-fit !text-[#426A66]"
                                        startIcon={<CardPos />}
                                        onClick={() => {
                                            if (info?.has_changed_password) {
                                                dispatch(
                                                    openPasswordDialog({
                                                        provider: game.name,
                                                    })
                                                );
                                            } else {
                                                handleWithdrawClick(
                                                    Number(currentAmount || 0),
                                                    game.provider
                                                );
                                            }
                                        }}
                                        type="button"
                                    >
                                        Withdraw
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </form>

            <WithdrawlModal
                open={open}
                handleClose={() => setOpen(false)}
                formik={formik}
                wallet={user?.wallet_address || ""}
                isLoading={withdrawing || isLoading}
            />
        </section>
    );
}