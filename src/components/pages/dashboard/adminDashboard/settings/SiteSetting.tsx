"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { InputLabel, OutlinedInput, Button, IconButton } from "@mui/material";
import InputFile from "@/components/atom/InputFile";
import { CloseCircle } from "@wandersonalwes/iconsax-react";
import { useGetSettingsQuery, useUpdateSettingMutation } from "@/services/settingApi";
import { useAppDispatch } from "@/hooks/hook";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { SiteInitialRequest } from "@/types/setting";

export default function SiteSetting() {
    const dispatch = useAppDispatch();
    const [updateSetting, { isLoading }] = useUpdateSettingMutation();
    const { data } = useGetSettingsQuery();

    const [serverFiles, setServerFiles] = React.useState({
        favicon: data?.data?.favicon || "",
        logo: data?.data?.logo || ""
    })

    React.useEffect(() => {
        setServerFiles({
            favicon: data?.data?.favicon || "",
            logo: data?.data?.logo || ""
        })
    }, [data]);

    const formik = useFormik({
        initialValues: data ? {
            site_name: data?.data?.site_name,
            favicon: null,
            logo: null,
            site_description: data?.data?.site_description,
            customer_support_email: data?.data?.customer_support_email,
            technical_support_email: data?.data?.technical_support_email,
            unique_selling_points: data?.data?.unique_selling_points.map((usp) => ({
                title: usp.title,
                description: usp.description,
                icon: null,
                icon_url: usp.icon_url
            }))
        } : SiteInitialRequest,
        enableReinitialize: true,
        validationSchema: Yup.object({
            // favicon: Yup.mixed().required("Favicon is required"),
            // logo: Yup.mixed().required("Logo is required"),
            site_name: Yup.string().required("Website title is required"),
            unique_selling_points: Yup.array().of(
                Yup.object({
                    title: Yup.string().required("USP title is required"),
                    description: Yup.string().required("USP description is required"),
                    // icon: Yup.mixed().required("USP icon is required"),
                })
            ),
        }),
        onSubmit: async (values) => {

            const formData = new FormData();

            if (values.favicon) formData.append("favicon", values.favicon);
            if (values.logo) formData.append("logo", values.logo);
            if (values.site_description) formData.append("site_description", values.site_description);
            if (values.technical_support_email) formData.append("technical_support_email", values.technical_support_email);
            if (values.customer_support_email) formData.append("customer_support_email", values.customer_support_email);

            if (data?.data?.logo) {
                formData.append("logo_url", serverFiles.logo)
            }
            if (data?.data?.favicon) {
                formData.append("favicon_url", serverFiles.favicon)
            }
            formData.append("site_name", values.site_name);


            values.unique_selling_points.forEach((usp, index) => {
                formData.append(`unique_selling_points[${index}][title]`, usp.title);
                formData.append(`unique_selling_points[${index}][description]`, usp.description);
                if (usp.icon) {
                    formData.append(`unique_selling_points[${index}][icon]`, usp.icon);
                }
                formData.append(`unique_selling_points[${index}][icon_url]`, usp.icon_url || "");


            });

            try {
                const response = await updateSetting(formData).unwrap();
                dispatch(
                    showToast({
                        message: response.message || "Setting Saved Successfully",
                        variant: ToastVariant.SUCCESS
                    })
                )
            }
            catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something Went Wrong",
                        variant: ToastVariant.ERROR
                    })
                )
            }

        },
    });


    const handleAddUSP = () => {
        formik.setFieldValue("unique_selling_points", [
            ...formik.values.unique_selling_points,
            { title: "", description: "", icon: null, icon_url: "" },
        ]);
    };

    const handleRemoveUSP = (index: number) => {
        const updated = [...formik.values.unique_selling_points];
        updated.splice(index, 1);
        formik.setFieldValue("unique_selling_points", updated);
    };

    const handleServerFileRemoval = (field: "favicon" | "logo", fileUrl?: string) => {
        setServerFiles((prev) => ({
            ...prev,
            [field]: fileUrl,
        }));
    };

    return (
        <form onSubmit={formik.handleSubmit}>
            {/* Site Setting */}
            <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">Site Settings</h2>
                </div>

                <div className="form__fields p-6 lg:p-10 grid gap-4 lg:gap-6 md:grid-cols-2">
                    {/* Website Title */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputLabel>Website Title<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="site_name"
                            placeholder="Enter Website Title"
                            value={formik.values.site_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                        <span className="error">
                            {formik.touched.site_name && formik.errors.site_name
                                ? formik.errors.site_name
                                : ""}
                        </span>
                    </div>
                    {/* Website Description */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputLabel>Website Description<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="site_description"
                            placeholder="Enter Website Description"
                            value={formik.values.site_description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                        <span className="error">
                            {formik.touched.site_description && formik.errors.site_description
                                ? formik.errors.site_description
                                : ""}
                        </span>
                    </div>

                    {/* Favicon */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputFile
                            name="favicon"
                            label="Website Favicon"
                            value={formik.values.favicon || null}
                            onChange={(file: File | File[] | null) => formik.setFieldValue("favicon", file)}
                            onBlur={() => formik.setFieldTouched("favicon", true)}
                            serverFile={!formik.values.favicon ? serverFiles?.favicon : ""}
                            onRemoveServerFile={() => handleServerFileRemoval("favicon", "")}
                        />
                        <span className="error">
                            {formik.touched.favicon && formik.errors.favicon ? formik.errors.favicon : ""}
                        </span>
                    </div>

                    {/* Logo */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputFile
                            name="logo"
                            label="Logo"
                            value={formik.values.logo || null}
                            onChange={(file: File | File[] | null) => formik.setFieldValue("logo", file)}
                            onBlur={() => formik.setFieldTouched("logo", true)}
                            serverFile={!formik.values.logo ? serverFiles?.logo : ""}
                            onRemoveServerFile={() => handleServerFileRemoval("logo", "")}
                        />
                        <span className="error">
                            {formik.touched.logo && formik.errors.logo ? formik.errors.logo : ""}
                        </span>
                    </div>

                    {/* Customer  Support Emaiol */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputLabel>Customer Support<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="customer_support_email"
                            placeholder="Enter Client Support Email"
                            value={formik.values.customer_support_email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                        <span className="error">
                            {formik.touched.customer_support_email && formik.errors.customer_support_email
                                ? formik.errors.customer_support_email
                                : ""}
                        </span>
                    </div>
                    {/* Customer  Support Emaiol */}
                    <div className="input__field col-span-1 md:col-span-2">
                        <InputLabel>Technical Support<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            name="technical_support_email"
                            placeholder="Enter Technical Support Email"
                            value={formik.values.technical_support_email}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}

                        />
                        <span className="error">
                            {formik.touched.technical_support_email && formik.errors.technical_support_email
                                ? formik.errors.technical_support_email
                                : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* USP Section */}
            <div className="form__field__wrapper border border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b border-gray">
                    <h2 className="text-[20px] font-bold">Unique Selling Points</h2>
                </div>

                <div className="form__fields p-6 lg:p-10 space-y-6">
                    {formik.values.unique_selling_points.map((usp, index) => {
                        return (
                            <div
                                key={index}
                                className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 items-start relative border border-gray rounded-lg p-4"
                            >
                                {formik.values.unique_selling_points.length > 1 && (
                                    <IconButton
                                        onClick={() => handleRemoveUSP(index)}
                                        className="!absolute !top-2 !right-2 !text-red-500 !justify-end !z-[9]"
                                    >
                                        <CloseCircle size={18} />
                                    </IconButton>
                                )}

                                {/* USP Title */}
                                <div className="input__field">
                                    <InputLabel>USP Title<span className="text-red-500">*</span></InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        name={`unique_selling_points[${index}].title`}
                                        placeholder="Enter USP Title"
                                        value={usp.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <span className="error">
                                        {formik.touched.unique_selling_points?.[index]?.title &&
                                            (formik.errors.unique_selling_points?.[index] as any)?.title
                                            ? (formik.errors.unique_selling_points?.[index] as any).title
                                            : ""}
                                    </span>
                                </div>

                                {/* USP Description */}
                                <div className="input__field">
                                    <InputLabel>USP Description<span className="text-red-500">*</span></InputLabel>
                                    <OutlinedInput
                                        fullWidth
                                        name={`unique_selling_points[${index}].description`}
                                        placeholder="Enter USP Description"
                                        value={usp.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    <span className="error">
                                        {formik.touched.unique_selling_points?.[index]?.description &&
                                            (formik.errors.unique_selling_points?.[index] as any)?.description
                                            ? (formik.errors.unique_selling_points?.[index] as any).description
                                            : ""}
                                    </span>
                                </div>

                                {/* USP Icon */}
                                <div className="input__field">
                                    <InputFile
                                        name={`unique_selling_points[${index}].icon`}
                                        label="USP Icon"
                                        value={usp.icon || null}
                                        onChange={(file: File | File[] | null) =>
                                            formik.setFieldValue(`unique_selling_points[${index}].icon`, file)
                                        }
                                        onBlur={() => formik.setFieldTouched(`unique_selling_points[${index}].icon`, true)}
                                        serverFile={typeof usp.icon_url === "string" ? usp.icon_url : ""}
                                        // handle remove icon (server file)
                                        onRemoveServerFile={() => {
                                            const updatedUSPs = [...formik.values.unique_selling_points];
                                            updatedUSPs[index] = {
                                                ...updatedUSPs[index],
                                                icon_url: "",
                                            };
                                            formik.setFieldValue("unique_selling_points", updatedUSPs);
                                        }}
                                    />
                                    <span className="error">
                                        {formik.touched.unique_selling_points?.[index]?.icon &&
                                            (formik.errors.unique_selling_points?.[index] as any)?.icon
                                            ? (formik.errors.unique_selling_points?.[index] as any).icon
                                            : ""}
                                    </span>
                                </div>
                            </div>
                        )
                    })}

                    <Button variant="text" color="primary" onClick={handleAddUSP} className="!p-0 !text-title !max-w-fit">
                        + Add More USP
                    </Button>
                </div>
            </div>

            <div className="text-right">
                <Button type="submit" variant="contained" color="primary">
                    Save Site Setting
                </Button>
            </div>
        </form>
    );
}
