"use client";

import { useAppDispatch, useAppSelector } from '@/hooks/hook';
import { useAddUserWalletMutation } from '@/services/userApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Button, InputLabel, OutlinedInput } from '@mui/material'
import { InfoCircle, WalletCheck } from '@wandersonalwes/iconsax-react'
import { useFormik } from 'formik';
import React from 'react'
import * as yup from 'yup'


const validationSchema = yup.object({
    wallet_address: yup.string().required("Wallet Address is Required")
})
export default function EditUserWallet() {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [connectWallet, { isLoading }] = useAddUserWalletMutation();
    const formik = useFormik({
        initialValues: {
            wallet_address: user?.wallet_address || "",
        },
        enableReinitialize: true,
        validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await connectWallet(values).unwrap();
                dispatch(
                    showToast({
                        message: response.message || "Unable to connect wallet. Try Again Later",
                        variant: ToastVariant.SUCCESS
                    })
                )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Unable to connect wallet. Try Again Later",
                        variant: ToastVariant.ERROR
                    })
                )
            }
        }
    })
    return (
        <div className="px-8 lg:pt-8 pb-8">
            <form onSubmit={formik.handleSubmit} className="wallet-form">
                <InputLabel htmlFor="wallet_address">Wallet Address</InputLabel>
                <OutlinedInput
                    name='wallet_address'
                    id='wallet_address'
                    value={formik.values.wallet_address}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder='Enter your bitcoin address'
                />
                <div className="info my-4">
                    <p className='flex items-center bg-[#EEFEC4] text-[#547D16] p-2 rounded-lg text-[10px] lg:text-[12px] gap-1 '><InfoCircle size={12} />You can only connect one wallet at a time. To update the wallet address,
                        change the wallet address and click update</p>
                </div>
                <Button type="submit" variant='contained' color='secondary' sx={{
                    color: "#1E3634",
                    fontSize: "12px"
                }} startIcon={<WalletCheck />}>Update</Button>
            </form>
        </div>
    )
}
