"use client"

import { useAppDispatch, useAppSelector } from '@/hooks/hook'
import { useAddUserWalletMutation } from '@/services/userApi'
import { showToast, ToastVariant } from '@/slice/toastSlice'
import { Button, OutlinedInput } from '@mui/material'
import { useFormik } from 'formik'
import * as yup from 'yup'


const validationSchema = yup.object({
    wallet_address: yup.string().required("Wallet Address is Required")
})
export default function ConnectWalletForm() {
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
        <form onSubmit={formik.handleSubmit}>
            <OutlinedInput
                name='wallet_address'
                id='wallet_address'
                value={formik.values.wallet_address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder='Enter your bitcoin address'
            />
            <Button type='submit' variant='contained' color='primary' className='!mt-3' disabled={!formik.dirty}>{isLoading ? "Connecting Wallet" : "Connect Wallet"}</Button>
        </form>
    )
}
