import GlassWrapper from "@/components/molecules/GlassWrapper";
import { US_STATES } from "@/constants/state";
import BitCoinIcon from "@/icons/BitCoinIcon";
import { Box, Button, InputLabel, MenuItem, Modal, OutlinedInput, Select } from "@mui/material";
import { BitcoinRefresh, SecuritySafe, TickCircle } from "@wandersonalwes/iconsax-react";
import { FormikProps } from "formik";
import Image from "next/image";
import React from "react";
import { WithdrawlFormValues } from ".";

const formFieldSx = {
    '& .MuiOutlinedInput-root, & .MuiPickersInputBase-root, & .MuiPickersOutlinedInput-root': {
        borderRadius: '27px',
        background: 'rgba(118, 107, 120, 0.55)',
        color: '#fff',
        '& .MuiOutlinedInput-notchedOutline, & .MuiPickersOutlinedInput-notchedOutline': {
            border: '0.576px solid rgba(255, 255, 255, 0.04)',
        },
        '&:hover .MuiOutlinedInput-notchedOutline, &:hover .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.2)',
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiPickersOutlinedInput-notchedOutline': {
            borderColor: '#B801C0',
        },
    },
    '& .MuiOutlinedInput-input, & .MuiPickersInputBase-input': {
        padding: '12px 16px',
        color: '#fff',
        '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.2)',
            fontWeight: 300,
            fontSize: '12px',
            opacity: 1,
        },
    },
    '& .MuiInputAdornment-root': {
        marginRight: '8px',
    },
    '& .MuiInputAdornment-root button': {
        color: 'rgba(255, 255, 255, 0.7)',
        '&:hover': {
            color: '#fff',
            background: 'rgba(255, 255, 255, 0.08)',
        }
    },
    '& .MuiIconButton-root': {
        padding: '8px',
    }
};

export default function WithdrawlModal({
    open,
    handleClose,
    formik,
    wallet

}: {
    open: boolean;
    handleClose: () => void;
    formik: FormikProps<WithdrawlFormValues>;
    wallet: string;
}) {
    const [isEditing, setIsEditing] = React.useState(false);

    React.useEffect(() => {
        if (open) {
            formik.setFieldValue("wallet_address", wallet);
            setIsEditing(false);
        }
    }, [open, wallet]);

    const handleChangeAddress = () => {
        setIsEditing(true);
        formik.setFieldValue("wallet_address", "");
    };

    const handleTypeChange = (value: string) => {
        formik.setFieldValue("type", value);
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
                    maxWidth: "674px",
                    width: "100%",
                    maxHeight: "90vh",
                    overflowY: "auto",
                    background:
                        "linear-gradient(0deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.04) 100%), #3A013F",
                    boxShadow: 24,
                    p: { xs: 3, sm: 4 },
                    textAlign: "center",
                }}
            >
                {/* Wallet Banner */}
                <Image
                    src={"/assets/images/wallet-featured-image.png"}
                    alt=""
                    width={174}
                    height={140}
                    className="mx-auto"
                />

                <span className="py-2 px-3 rounded-3xl bg-[#DBFBF6] border border-[#426A66] text-[#426A66] flex justify-center items-center max-w-fit mx-auto my-4 lg:my-6">
                    <SecuritySafe />
                    Safe and secure
                </span>

                <h1 className="text-[24px] leading-[120%] font-[700]">
                    Confirm your Wallet Address
                </h1>

                <p className="text-[11px] leading-[150%] text-center max-w-[420px] mx-auto mt-3 mb-6">
                    Your Withdrawn amount will be sent to the following address.
                </p>

                <form onSubmit={formik.handleSubmit} className="flex flex-col gap-3">
                    <div className="grid sm:grid-cols-2 mb-8 gap-6">
                        <div className="col-span-1">
                            <GlassWrapper>
                                <div
                                    className="py-5 px-4 flex justify-between items-center cursor-pointer transition-all hover:bg-white/5"
                                    onClick={() => handleTypeChange("tryspeed")}
                                >
                                    <span className="text-[12px] flex items-center justify-start gap-2 max-w-[80%] text-start">
                                        <BitcoinRefresh />
                                        Try Speed
                                    </span>
                                    {formik.values.type === "tryspeed" ? (
                                        <TickCircle className="text-green-400" />
                                    ) : ""}
                                </div>
                            </GlassWrapper>
                        </div>
                        <div className="col-span-1">
                            <GlassWrapper>
                                <div
                                    className="py-5 px-4 flex justify-between items-center cursor-pointer transition-all hover:bg-white/5"
                                    onClick={() => handleTypeChange("auxvault")}
                                >
                                    <span className="text-[12px] flex items-center justify-start gap-2 max-w-[80%] text-start">
                                        <BitCoinIcon />
                                        AuxVault
                                    </span>
                                    {formik.values.type === "auxvault" ? (
                                        <TickCircle className="text-green-400" />
                                    ) : ""}
                                </div>
                            </GlassWrapper>
                        </div>
                    </div>
                    {formik.values.type === "tryspeed" ? <>
                        <div className="relative">
                            <InputLabel htmlFor="photoid_number" className="text-start">SSN <span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="photoid_number"
                                id="photoid_number"
                                value={formik.values.photoid_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your SSN"
                            />
                            {
                                formik.touched.photoid_number && formik.errors.photoid_number ?
                                    <span className="error text-start">{formik.errors.photoid_number || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="wallet_address" className="text-start">Wallet Address <span className="text-red-500">*</span></InputLabel>
                            <div className="relative">
                                <OutlinedInput
                                    name="wallet_address"
                                    id="wallet_address"
                                    value={formik.values.wallet_address}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter your bitcoin address"
                                    disabled={!isEditing}
                                />
                                {!isEditing && (
                                    <Button
                                        className="!p-0 !text-white"
                                        sx={{
                                            position: "absolute",
                                            top: "50%",
                                            transform: "translateY(-50%)",
                                            right: 16,
                                            maxWidth: "fit-content",
                                            textDecoration: "underline",
                                        }}
                                        type="button"
                                        onClick={handleChangeAddress}
                                    >
                                        | &nbsp;&nbsp;Change Address
                                    </Button>
                                )}
                            </div>
                        </div>
                    </> : <div className="flex flex-col gap-2 md:grid md:grid-cols-2">
                        <div className="relative">
                            <InputLabel htmlFor="customer_name" className="text-start">Name<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="customer_name"
                                id="customer_name"
                                value={formik.values.customer_name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your name"
                            />
                            {
                                formik.touched.customer_name && formik.errors.customer_name ?
                                    <span className="error text-start">{formik.errors.customer_name || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="customer_email" className="text-start">Email<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="customer_email"
                                id="customer_email"
                                value={formik.values.customer_email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your email"
                            />
                            {
                                formik.touched.customer_email && formik.errors.customer_email ?
                                    <span className="error text-start">{formik.errors.customer_email || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="phone_number" className="text-start">Phone Number <span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="phone_number"
                                id="phone_number"
                                value={formik.values.phone_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your phone number"
                            />
                            {
                                formik.touched.phone_number && formik.errors.phone_number ?
                                    <span className="error text-start">{formik.errors.phone_number || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="postal_code" className="text-start">Postal Code<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="postal_code"
                                id="postal_code"
                                value={formik.values.postal_code}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your postal code"
                            />
                            {
                                formik.touched.postal_code && formik.errors.postal_code ?
                                    <span className="error text-start">{formik.errors.postal_code || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="card_number" className="text-start">Card Number <span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="card_number"
                                id="card_number"
                                value={formik.values.card_number}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your card number"
                            />
                            {
                                formik.touched.card_number && formik.errors.card_number ?
                                    <span className="error text-start">{formik.errors.card_number || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="cvv" className="text-start">CVV <span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="cvv"
                                id="cvv"
                                value={formik.values.cvv}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your CVV"
                            />
                            {
                                formik.touched.cvv && formik.errors.cvv ?
                                    <span className="error text-start">{formik.errors.cvv || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="expiry_date" className="text-start">Expiry Date<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="expiry_date"
                                id="expiry_date"
                                value={formik.values.expiry_date}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Ex. MMYY"
                            />
                            {
                                formik.touched.expiry_date && formik.errors.expiry_date ?
                                    <span className="error text-start">{formik.errors.expiry_date || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="billing_address" className="text-start">Billing Address<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="billing_address"
                                id="billing_address"
                                value={formik.values.billing_address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your billing address"
                            />
                            {
                                formik.touched.billing_address && formik.errors.billing_address ?
                                    <span className="error text-start">{formik.errors.billing_address || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="billing_city" className="text-start">Billing City<span className="text-red-500">*</span></InputLabel>
                            <OutlinedInput
                                name="billing_city"
                                id="billing_city"
                                value={formik.values.billing_city}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter your SSN"
                            />
                            {
                                formik.touched.billing_city && formik.errors.billing_city ?
                                    <span className="error text-start">{formik.errors.billing_city || ""}</span> : null
                            }
                        </div>
                        <div className="relative">
                            <InputLabel htmlFor="billing_state">Billing State</InputLabel>

                            <Select
                                fullWidth
                                id="billing_state"
                                name="billing_state"
                                displayEmpty
                                value={formik.values.billing_state}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                sx={formFieldSx}
                                renderValue={(selected) =>
                                    selected === "" ? "Select a State" : selected
                                }
                            >
                                <MenuItem value="">
                                    <em>Select a State</em>
                                </MenuItem>

                                {US_STATES.map((state) => (
                                    <MenuItem key={state.value} value={state.value}>
                                        {state.label}
                                    </MenuItem>
                                ))}
                            </Select>

                            {
                                formik.touched.billing_state && formik.errors.billing_state ?
                                    <span className="error text-start">{formik.errors.billing_state || ""}</span> : null
                            }
                        </div>


                    </div>}

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        className="!mt-3"
                        disabled={!formik.values.wallet_address}
                    >
                        Withdraw Now
                    </Button>
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

