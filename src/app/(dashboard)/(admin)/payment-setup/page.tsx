"use client";
import PageHeader from '@/components/molecules/PageHeader';
import { useAppDispatch } from '@/hooks/hook';
import { useCreatePaymentSetupMutation, useGetPaymentSetupQuery } from '@/services/paymentSetupApi';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import { Button, InputLabel, OutlinedInput } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function PaymentSetup() {
    const dispatch = useAppDispatch();
    const { data } = useGetPaymentSetupQuery();
    const [updatePaymentSetup, { isLoading }] = useCreatePaymentSetupMutation();
    const formik = useFormik({
        initialValues: {
            idem_payment_uri: 'https://gateway.idem-club.info/idem/',
            idem_hashkey: '',
            idem_merchant_id: '',
        },
        validationSchema: Yup.object({
            idem_payment_uri: Yup.string()
                .required('Payment URI is required')
                .url('Must be a valid URL'),
            idem_hashkey: Yup.string()
                .required('Hash key is required')
                .min(8, 'Hash key must be at least 6 characters'),
            idem_merchant_id: Yup.string()
                .required('Merchant ID is required')
                .matches(/^\d+$/, 'Merchant ID must be numeric'),
        }),
        onSubmit: (values) => {
            // console.log('Submitting IDEM Payment Setup:', values);

            try {

                const response = { message: "ok" };
                dispatch(
                    showToast({
                        message: response?.message || "Payment Setup updated successfully",
                        variant: ToastVariant.ERROR
                    })
                )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Error Updating Paymnet Setting",
                        variant: ToastVariant.ERROR
                    })
                )
            }
        },
    });

    return (
        <>
            <PageHeader
                title='Payment Setup'
            />
            <form
                onSubmit={formik.handleSubmit}
                className="form__field__wrapper border border-gray rounded-[16px] mb-6"
            >
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">IDEM Payment Setup</h2>
                </div>

                <div className="form__fields p-6 lg:p-10 grid gap-4 lg:gap-6 md:grid-cols-2">
                    {/* IDEM Payment URI */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputLabel>
                            IDEM Payment URI<span className="text-red-500">*</span>
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="idem_payment_uri"
                            placeholder="Enter IDEM Payment URI"
                            value={formik.values.idem_payment_uri}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.idem_payment_uri && formik.errors.idem_payment_uri
                                ? formik.errors.idem_payment_uri
                                : ''}
                        </span>
                    </div>

                    {/* IDEM Hash Key */}
                    <div className="input__field">
                        <InputLabel>
                            IDEM Hash Key<span className="text-red-500">*</span>
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="idem_hashkey"
                            placeholder="Enter IDEM Hash Key"
                            value={formik.values.idem_hashkey}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.idem_hashkey && formik.errors.idem_hashkey
                                ? formik.errors.idem_hashkey
                                : ''}
                        </span>
                    </div>

                    {/* IDEM Merchant ID */}
                    <div className="input__field">
                        <InputLabel>
                            IDEM Merchant ID<span className="text-red-500">*</span>
                        </InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="idem_merchant_id"
                            placeholder="Enter IDEM Merchant ID"
                            value={formik.values.idem_merchant_id}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.idem_merchant_id && formik.errors.idem_merchant_id
                                ? formik.errors.idem_merchant_id
                                : ''}
                        </span>
                    </div>
                </div>

                <div className="px-10 pb-6 flex justify-end">
                    <Button
                        variant="contained"
                        type="submit"
                        className="bg-primary text-white"
                    >
                        Save Settings
                    </Button>
                </div>
            </form>
        </>
    );
}
