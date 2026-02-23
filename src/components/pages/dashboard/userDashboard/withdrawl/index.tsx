"use client";

import { useAppDispatch } from "@/hooks/hook";
import { useSubmitMassPayPaymentFieldsMutation } from "@/services/transaction";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { openPasswordDialog } from "@/slice/updatePasswordSlice";
import { GameResponseProps } from "@/types/game";
import { MasspayPaymentFields } from "@/types/transaction";
import { Button, OutlinedInput } from "@mui/material";
import { CardPos } from "@wandersonalwes/iconsax-react";
import { useFormik } from "formik";
import Image from "next/image";
import React from "react";
import * as Yup from "yup";
import WithdrawlModal from "./WithdrawlModal";

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
});

export type WithdrawlFormValues = {
    game_provider: string;
    withdrawl_amounts: Record<string, number | "">;
    type: string;
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
    const gameInfo = coins?.data?.game_information || {};
    const dispatch = useAppDispatch();

    const [withdrawMoney, { isLoading }] = useSubmitMassPayPaymentFieldsMutation();

    const formik = useFormik<WithdrawlFormValues>({
        initialValues: {
            game_provider: "",
            withdrawl_amounts: {},
            type: "",
            payment_fields: []
        },
        validationSchema,
        enableReinitialize: true,

        onSubmit: async (values) => {
            try {
                const amount = values.withdrawl_amounts[values.game_provider];

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
                    // Fixed: Set errors as object, not array
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

                const payload: any = {
                    amount: Number(amount),
                    game_provider: values.game_provider,
                };

                if (values.type && formik.values.payment_fields.length > 0) {
                    payload.values = formik.values.payment_fields;
                }

                const response = await withdrawMoney({ token: values.type, body: payload }).unwrap();

                setOpen(false);
                formik.resetForm();

                dispatch(
                    showToast({
                        message: response?.message || "Withdraw request submitted successfully!",
                        variant: ToastVariant.SUCCESS,
                    })
                );
            } catch (e: any) {
                console.log("Withdrawal Error:", e);
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something went wrong",
                        variant: ToastVariant.ERROR,
                    })
                );
            }
        },
    });

    const handleWithdrawlChange = (provider: string, value: string) => {
        if (value === "") {
            formik.setFieldValue(`withdrawl_amounts.${provider}`, "");
        } else {
            const num = Number(value);
            formik.setFieldValue(
                `withdrawl_amounts.${provider}`,
                isNaN(num) ? "" : num
            );
        }
    };

    const handleWithdrawClick = (balance: number, provider: string) => {
        if (balance < 2) {
            dispatch(
                showToast({
                    message: "Withdraw Amount must be at least $2",
                    variant: ToastVariant.ERROR,
                })
            );
            return;
        }
        formik.setFieldValue("game_provider", provider);
        setOpen(true);
    };

    const handleModalClose = () => {
        setOpen(false);
        formik.setFieldValue("payment_fields", []);
        formik.setFieldValue("type", "");
        if (formik.errors.payment_fields) {
            const newErrors = { ...formik.errors };
            delete newErrors.payment_fields;
            formik.setErrors(newErrors);
        }
    };

    console.log("Formik Errors:", formik.values.withdrawl_amounts);
    return (
        <section className="withdrawl__root">
            <div className="section__title mb-4 lg:mb-8 max-w-[560px]">
                <h1 className="mb-2 text-[24px] lg:text-[32px]">Withdraw Coins <span className="text-[#FBA027] text-[20px]">(Min Withdrawl $2)</span></h1>
                <p className="text-[11px] lg:text-[13px]">
                    To start playing and cashing out your winnings, you'll need a crypto
                    wallet to purchase E-Credits and receive payouts. Don't worry—it's quick
                    and easy!
                </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4">
                    {games?.data?.data
                        ?.filter((game) => game.provider.toLowerCase() !== "goldcoincity")
                        .map((game) => {
                            const info = gameInfo[game.provider.toLowerCase()] || {
                                available: 0,
                                type: "sc",
                            };

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
                                                {game?.name}
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
                                                value={
                                                    formik.values.withdrawl_amounts[game.provider] ??
                                                    ""
                                                }
                                                onChange={(e) =>
                                                    handleWithdrawlChange(
                                                        game.provider,
                                                        e.target.value
                                                    )
                                                }
                                                inputProps={{ min: 2 }}
                                                placeholder="5.0"
                                                error={Boolean(
                                                    (formik.errors.withdrawl_amounts as any)?.[
                                                    game.provider
                                                    ]
                                                )}
                                            />
                                            <Button
                                                className="!p-0 !text-white"
                                                sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    transform: " translateY(-50%)",
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
                                        {(formik.errors.withdrawl_amounts as any)?.[
                                            game.provider
                                        ] && (
                                                <span className="text-red-400 text-xs">
                                                    {
                                                        (formik.errors.withdrawl_amounts as any)?.[
                                                        game.provider
                                                        ]
                                                    }
                                                </span>
                                            )}
                                        <span className="text-[8px] lg:text-[10px]">Min $2.0</span>
                                    </div>

                                    {/* Withdraw Button */}
                                    {game.provider !== "goldcoincity" && (
                                        <div className="lg:col-span-1 text-end">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className="md:!max-w-fit !text-[#426A66]"
                                                startIcon={<CardPos />}
                                                // disabled={info.available < 40}
                                                onClick={() => {
                                                    if (info?.has_changed_password) {
                                                        dispatch(openPasswordDialog({
                                                            provider: game?.provider,
                                                        }));
                                                    }
                                                    else {
                                                        handleWithdrawClick(
                                                            Number(
                                                                formik.values.withdrawl_amounts[
                                                                game.provider
                                                                ] || 0
                                                            ),
                                                            game.provider
                                                        );
                                                    }
                                                }}
                                                type="button"
                                            >
                                                Withdraw
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            </form>

            <WithdrawlModal open={open} handleClose={handleModalClose} formik={formik} isLoading={isLoading} />
        </section>
    );
}