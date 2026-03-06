"use client";

import PasswordField from "@/components/molecules/PasswordField";
import { RootState } from "@/hooks/store";
import { useUpdateUserGamePasswordMutation } from "@/services/userApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { closeDialog } from "@/slice/updatePasswordSlice";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function UpdatePassword() {
    const dispatch = useDispatch();
    const { open, provider, hasChangedPassword } = useSelector((state: RootState) => state?.updatePasswordSlice);

    const [updateNewPassword, { isLoading }] = useUpdateUserGamePasswordMutation();
    console.log({
        open, provider
    })
    const formik = useFormik({
        initialValues: { password: "" },
        validationSchema: Yup.object({
            password: Yup.string()
                .min(6, "Password must be at least 6 characters")
                .required("Password is required"),
        }),
        onSubmit: async (values) => {

            try {
                console.log("New password:", values.password);
                const response = await updateNewPassword({
                    password: values.password,
                    provider: provider || ""
                }).unwrap();
                dispatch(
                    showToast({
                        variant: ToastVariant.ERROR,
                        message: response.message || "Something went wrong"
                    })
                )
                dispatch(closeDialog());
            } catch (e: any) {
                dispatch(
                    showToast({
                        variant: ToastVariant.ERROR,
                        message: e?.data?.message || "Something went wrong"
                    })
                )
            }
        },
    });


    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <div className="section__title mb-2">
                    <h1 className="text-[24px] lg:text-[32px] font-bold mt-2">
                        Enter your new password
                    </h1>
                    <p className="text-[14px]">
                        Our system has detected a password change for{" "}
                        <strong>{provider}</strong>. Please update your new password.
                    </p>
                </div>
            </DialogTitle>

            <form onSubmit={formik.handleSubmit} className="p-8">
                <DialogContent sx={{ p: 0 }}>
                    <PasswordField
                        name="password"
                        label="Password*"
                        placeholder="XXXXXXX"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password ? formik.errors.password : undefined}
                    />
                </DialogContent>

                <DialogActions className="flex justify-between p-4 mt-4">
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => dispatch(closeDialog())}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={!formik.dirty || isLoading}
                    >
                        {isLoading ? "Updating..." : "Save"}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
