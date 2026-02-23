"use client";
import GlassWrapper from "@/components/molecules/GlassWrapper";
import { useAppDispatch } from "@/hooks/hook";
import { useGetMassPayPaymentFieldsMutation, useGetMassPayPaymentMethodsQuery } from "@/services/transaction";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { MasspayPaymentFields } from "@/types/transaction";
import { Box, Button, Grow, Modal } from "@mui/material";
import { BitcoinRefresh, InfoCircle, SecuritySafe, TickCircle } from "@wandersonalwes/iconsax-react";
import { FormikProps } from "formik";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { WithdrawlFormValues } from ".";
import { RenderFields } from "./renderFields";

const ShimmerCard = () => (
    <div className="col-span-1">
        <GlassWrapper>
            <div className="py-5 px-4 flex justify-between items-center animate-pulse">
                <div className="flex items-center gap-2 flex-1">
                    <div className="w-5 h-5 bg-white/20 rounded-full"></div>
                    <div className="h-4 bg-white/20 rounded w-24"></div>
                </div>
                <div className="w-5 h-5 bg-white/20 rounded-full"></div>
            </div>
        </GlassWrapper>
    </div>
);

const FeeInfoBlock = ({ fee, methodName }: { fee: number; methodName: string }) => (
    <Grow in timeout={400}>
        <div className="mb-4 p-4 rounded-xl 
            bg-gradient-to-r 
            from-yellow-200/40 
            via-yellow-100/30 
            to-amber-200/30 
            border-l-4 border-yellow-300 
            backdrop-blur-sm">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                    <InfoCircle size={20} className="text-[#FBA027]" variant="Bold" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                        <h4 className="text-sm font-semibold text-white/90">Transaction Fee</h4>
                        <span className="text-yellow-300  font-bold text-base">${fee.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed text-start">
                        A fee of <span className="text-yellow-300  font-medium">${fee.toFixed(2)}</span> will be charged for this <span className="text-white/80 font-medium">{methodName}</span> transaction.
                    </p>
                </div>
            </div>
        </div>
    </Grow>
);

export default function WithdrawlModal({
    open,
    handleClose,
    formik,
    isLoading
}: {
    open: boolean;
    handleClose: () => void;
    formik: FormikProps<WithdrawlFormValues>;
    isLoading: boolean
}) {
    const [fields, setFields] = useState<MasspayPaymentFields[]>([]);
    const dispatch = useAppDispatch();
    const { data: withdrawlOptions, isLoading: loadingWithdrawlOptions } = useGetMassPayPaymentMethodsQuery();
    const [getMassPayFields, { isLoading: gettingFields }] = useGetMassPayPaymentFieldsMutation();

    const selectedMethod = useMemo(() => {
        if (!formik.values.type || !withdrawlOptions?.data) return null;
        return withdrawlOptions.data.find(option => option.destination_token === formik.values.type);
    }, [formik.values.type, withdrawlOptions]);

    const handleTypeChange = (value: string) => {
        formik.setFieldValue("type", value);
        formik.setFieldValue("payment_fields", {});
        setFields([]);
    };

    const handleContinueWithdrawl = async () => {
        if (!formik.values.type) {
            dispatch(
                showToast({
                    message: "Please select a payment method",
                    variant: ToastVariant.ERROR
                })
            );
            return;
        }

        try {
            const response = await getMassPayFields({ token: formik.values.type }).unwrap();
            const fetchedFields = response?.data || [];

            setFields(fetchedFields);

            formik.setFieldValue(
                "payment_fields",
                fetchedFields.map((item) => ({
                    ...item,
                    value: item.value || "",
                }))
            );


        } catch (e: any) {
            dispatch(
                showToast({
                    message: e?.data?.message || "Failed to get payment fields. Please try again.",
                    variant: ToastVariant.ERROR
                })
            );
        }
    };

    const handleBackToPaymentMethods = () => {
        setFields([]);
        formik.setFieldValue("payment_fields", {});
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    borderRadius: "24px",
                    maxWidth: "992px",
                    width: "100%",
                    background:
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), #3A013F",
                    boxShadow: 24,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                    overflow: "auto",
                    maxHeight: "90vh"
                }}
            >
                {/* Wallet Banner */}
                {/* <Image
                    src={"/assets/images/wallet-featured-image.png"}
                    alt=""
                    width={174}
                    height={140}
                    className="mx-auto"
                /> */}

                <span className="py-2 px-3 rounded-3xl bg-[#DBFBF6] border border-[#426A66] text-[#426A66] flex justify-center items-center max-w-fit mx-auto mb-4 lg:mb-6">
                    <SecuritySafe />
                    Safe and secure
                </span>

                <h1 className="text-[24px] leading-[120%] font-[700] capitalize">
                    {fields.length > 0 ? "Enter Payment Details" : `Game ${formik.values.game_provider} $ ${formik.values.withdrawl_amounts[formik.values.game_provider]}`}
                </h1>

                <p className="text-[11px] leading-[150%] text-center max-w-[420px] mx-auto mt-3 mb-6">
                    {fields.length > 0
                        ? "Please fill in all the required information to complete your withdrawal."
                        : "Your Withdrawn amount will be sent to the following address."}
                </p>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3 h-full overflow-auto">
                    <div className="grid sm:grid-cols-2 md:grid-cols-3 mb-8 gap-6">
                        {loadingWithdrawlOptions && (
                            <>
                                <ShimmerCard />
                                <ShimmerCard />
                            </>
                        )}
                        {!loadingWithdrawlOptions && withdrawlOptions?.data && withdrawlOptions?.data?.length > 0 &&
                            withdrawlOptions?.data?.map((option) => (
                                <div className="col-span-1" key={option?.id}>
                                    <GlassWrapper>
                                        <div
                                            className="py-5 px-4 flex justify-between items-center cursor-pointer transition-all hover:bg-white/5 h-full"
                                            onClick={() => handleTypeChange(option?.destination_token)}
                                        >
                                            <span className="text-[12px] flex items-center justify-start gap-2 max-w-[80%] text-start">
                                                {option.thumbnail_url ? <Image src={option?.thumbnail_url} alt={option?.name} width={120} height={40} className="object-contain max-w-16" /> : <BitcoinRefresh />}
                                                <span>
                                                    {option?.name}
                                                </span>
                                            </span>
                                            {formik.values.type === option?.destination_token ? (
                                                <TickCircle className="text-green-400" />
                                            ) : ""}
                                        </div>

                                    </GlassWrapper>
                                </div>
                            ))
                        }
                    </div>
                    {selectedMethod && (
                        <FeeInfoBlock
                            fee={selectedMethod.fee}
                            methodName={selectedMethod.name}
                        />
                    )}
                    {fields.length > 0 ? (
                        <div className="flex flex-col md:grid grid-cols-2 gap-4">
                            {fields.map((field) => (
                                <div className={field.type === "IDSelfieCollection" ? "col-span-2" : "col-span-1"} key={field.token}>
                                    {field.type === "IDSelfieCollection" ? <Link href={field.value} className="bg-primary-grad ss-btn">{field.label}</Link> : <RenderFields field={field} formik={formik} disabled={fields.some(field => field.type === "IDSelfieCollection") || isLoading} />}
                                </div>
                            ))}
                        </div>

                    ) : ""}

                    {fields.length === 0 ?
                        <>

                            <Button
                                variant="contained"
                                color="primary"
                                className="!mt-3"
                                onClick={handleContinueWithdrawl}
                                disabled={!formik.values.type || gettingFields}
                            >
                                {gettingFields ? "Loading Fields..." : "Continue Withdrawal"}
                            </Button>
                        </>
                        :
                        <>

                            <div className="flex gap-3 mt-4">
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    fullWidth
                                    onClick={handleBackToPaymentMethods}
                                    type="button"
                                >
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    type="submit"
                                    disabled={fields.some(field => field.type === "IDSelfieCollection") || isLoading}
                                >
                                    {isLoading ? "Processing..." : "Withdraw Now"}
                                </Button>
                            </div>
                        </>}
                </form>

                {/* Powered by */}
                <p className="text-[11px] leading-[120%] mt-8 mb-2">Powered By</p>
                <div className="flex justify-center items-center gap-4">
                    <Image src="/assets/images/payment-01.png" alt="" width={78} height={24} />
                    <Image src="/assets/images/payment-02.png" alt="" width={78} height={24} />
                    <Image src="/assets/images/payment-03.png" alt="" width={78} height={24} />
                </div>
            </Box>
        </Modal>
    );
}