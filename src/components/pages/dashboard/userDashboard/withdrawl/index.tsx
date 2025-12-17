
"use client";

import { useAppDispatch, useAppSelector } from "@/hooks/hook";
import { useWithdrawlMutation } from "@/services/transaction";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { openPasswordDialog } from "@/slice/updatePasswordSlice";
import { GameResponseProps } from "@/types/game";
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
    photoid_number: Yup.string().required("SSN is required"),
});

export type WithdrawlFormValues = {
    game_provider: string;
    withdrawl_amounts: Record<string, number | "">;
    wallet_address: string;
    photoid_number: string;
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

    const [withdrawMoney, { isLoading: widthdrawing }] =
        useWithdrawlMutation();

    const formik = useFormik<WithdrawlFormValues>({
        initialValues: {
            game_provider: "",
            withdrawl_amounts: {},
            wallet_address: user?.wallet_address || "",
            photoid_number: "",
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const amount =
                    values.withdrawl_amounts[values.game_provider];
                const response = await withdrawMoney({
                    wallet: values.wallet_address,
                    amount: Number(amount),
                    game_provider: values.game_provider,
                    photoid_number:values.photoid_number
                }).unwrap();

                setOpen(false);
                dispatch(
                    showToast({
                        message: response?.message || "Withdraw request submitted successfully!",
                        variant: ToastVariant.SUCCESS,
                    })
                );
            } catch (e: any) {
                console.log(e);
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something went wrong",
                        variant: ToastVariant.ERROR,
                    })
                );
            }
        },
    });

    const handleWithdrawlChange = (
        provider: string,
        value: string
    ) => {
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

    const handleWithdrawClick = (
        balance: number,
        provider: string
    ) => {
        if (balance < 2) {
            dispatch(
                showToast({
                    message:
                        "Insufficient balance to withdraw (Min $2 required)",
                    variant: ToastVariant.ERROR,
                })
            );
            return;
        }
        formik.setFieldValue("game_provider", provider);
        setOpen(true);
    };

    return (
        <section className="withdrawl__root">
            <div className="section__title mb-4 lg:mb-8 max-w-[520px]">
                <h1 className="mb-2 text-[24px] lg:text-[32px]">
                    Withdraw Coins
                </h1>
                <p className="text-[11px] lg:text-[13px]">
                    To start playing and cashing out your winnings, you’ll
                    need a crypto wallet to purchase E-Credits and receive
                    payouts. Don't worry—it’s quick and easy!
                </p>
            </div>

            <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-4">
                    {games?.data?.data
                        ?.filter((game) => game.provider.toLowerCase() !== "goldcoincity")
                        .map((game) => {
                            const info =
                                gameInfo[game.provider.toLowerCase()] || {
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
                                            src={
                                                game.thumbnail ||
                                                "/assets/images/fallback.png"
                                            }
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
                                                    formik.values.withdrawl_amounts[
                                                    game.provider
                                                    ] ?? ""
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
                                        <span className="text-[8px] lg:text-[10px]">
                                            Min $2.0
                                        </span>
                                    </div>

                                    {/* Withdraw Button */}
                                    {game.provider !== "goldcoincity" && (
                                        <div className="lg:col-span-1 text-end">
                                            <Button
                                                variant="contained"
                                                color="secondary"
                                                className="md:!max-w-fit !text-[#426A66]"
                                                startIcon={<CardPos />}
                                                onClick={() => {
                                                    if (info?.has_changed_password) {
                                                        dispatch(openPasswordDialog({
                                                            provider: game?.name,
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
                                                        )
                                                    }
                                                }

                                                }
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

            <WithdrawlModal
                open={open}
                handleClose={() => setOpen(false)}
                formik={formik}
                wallet={user?.wallet_address || ""}
            />
        </section >
    );
}
