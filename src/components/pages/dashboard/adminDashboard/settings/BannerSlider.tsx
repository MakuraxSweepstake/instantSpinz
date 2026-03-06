"use client";

import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    InputLabel,
    OutlinedInput,
    IconButton,
    FormControlLabel,
    Typography,
    Switch,
} from "@mui/material";
import InputFile from "@/components/atom/InputFile";
import { CloseCircle } from "@wandersonalwes/iconsax-react";
import { useAppDispatch } from "@/hooks/hook";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { useGetAllBannerQuery, useUpdateBannerMutation } from "@/services/settingApi";

const validationSchema = Yup.object({
    banners: Yup.array().of(
        Yup.object({
            name: Yup.string().required("Banner title is required"),
            description: Yup.string().required("Banner description is required"),
            cta_link: Yup.string().required("CTA link is required"),
            // image: Yup.mixed().required("Banner image is required"),
            type: Yup.boolean(),
        })
    ),
});

export default function BannerSlider() {
    const dispatch = useAppDispatch();
    const { data, isLoading } = useGetAllBannerQuery();
    const [updateBanner, { isLoading: updating }] = useUpdateBannerMutation();

    const formik = useFormik({
        initialValues: {
            banners: data?.data?.length
                ? data.data.map((item: any) => ({
                    name: item.name || "",
                    description: item.description || "",
                    cta_link: item.cta_link || "",
                    image: null as File | null,
                    type: item.type || false,
                    image_url: item.image_url || "",
                }))
                : [
                    {
                        name: "",
                        description: "",
                        cta_link: "",
                        image: null as File | null,
                        type: false,
                        image_url: "",
                    },
                ],
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();

            try {
                values.banners.forEach((banner, index) => {
                    formData.append(`banners[${index}][name]`, banner.name);
                    formData.append(
                        `banners[${index}][description]`,
                        banner.description
                    );
                    formData.append(`banners[${index}][cta_link]`, banner.cta_link);
                    formData.append(
                        `banners[${index}][type]`,
                        banner.type ? "true" : "false"
                    );

                    if (banner.image) {
                        formData.append(`banners[${index}][image]`, banner.image);
                    }
                    formData.append(`banners[${index}][image_url]`, banner.image_url || "");
                });
                const response = await updateBanner(formData).unwrap();
                dispatch(
                    showToast({
                        message: response?.message || "Banner created successfully",
                        variant: ToastVariant.SUCCESS,
                    })
                );
            } catch (e: any) {
                dispatch(
                    showToast({
                        message: e?.data?.message || "Something went wrong",
                        variant: ToastVariant.ERROR,
                    })
                );
            }
        },
    });

    const handleAddBanner = () => {
        formik.setFieldValue("banners", [
            ...formik.values.banners,
            {
                title: "",
                description: "",
                cta_link: "",
                image: null,
                isSubBanner: false,
            },
        ]);
    };

    const handleRemoveBanner = (index: number) => {
        const updated = [...formik.values.banners];
        updated.splice(index, 1);
        formik.setFieldValue("banners", updated);
    };

    return (
        <form
            onSubmit={formik.handleSubmit}
            className="form__field__wrapper border border-gray rounded-[16px] mb-6"
        >
            <div className="form__title py-6 px-10 border-b border-gray">
                <h2 className="text-[20px] leading-[140%] font-bold">Banner Slider</h2>
            </div>

            <div className="form__fields p-6 lg:p-10 space-y-6">
                {formik.values.banners.map((banner, index) => (
                    <div
                        key={index}
                        className="grid gap-4 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 items-start relative border border-gray rounded-lg p-4"
                    >
                        {formik.values.banners.length > 1 && (
                            <IconButton
                                onClick={() => handleRemoveBanner(index)}
                                className="!absolute !top-2 !right-2 !text-red-500 !z-[9] max-w-fit"
                            >
                                <CloseCircle size={18} />
                            </IconButton>
                        )}

                        {/* Banner Title */}
                        <div className="input__field">
                            <InputLabel>
                                Banner Title<span className="text-red-500">*</span>
                            </InputLabel>
                            <OutlinedInput
                                fullWidth
                                name={`banners[${index}].name`}
                                placeholder="Enter Banner Title"
                                value={banner.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className="error">
                                {formik.touched.banners?.[index]?.name &&
                                    (formik.errors.banners?.[index] as any)?.name
                                    ? (formik.errors.banners?.[index] as any).name
                                    : ""}
                            </span>
                        </div>

                        {/* Banner Description */}
                        <div className="input__field">
                            <InputLabel>
                                Banner Description<span className="text-red-500">*</span>
                            </InputLabel>
                            <OutlinedInput
                                fullWidth
                                name={`banners[${index}].description`}
                                placeholder="Enter Banner Description"
                                value={banner.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className="error">
                                {formik.touched.banners?.[index]?.description &&
                                    (formik.errors.banners?.[index] as any)?.description
                                    ? (formik.errors.banners?.[index] as any).description
                                    : ""}
                            </span>
                        </div>

                        {/* Banner CTA Link */}
                        <div className="input__field">
                            <InputLabel>
                                Banner CTA Link<span className="text-red-500">*</span>
                            </InputLabel>
                            <OutlinedInput
                                fullWidth
                                name={`banners[${index}].cta_link`}
                                placeholder="Enter CTA Link"
                                value={banner.cta_link}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            <span className="error">
                                {formik.touched.banners?.[index]?.cta_link &&
                                    (formik.errors.banners?.[index] as any)?.cta_link
                                    ? (formik.errors.banners?.[index] as any).cta_link
                                    : ""}
                            </span>
                        </div>

                        {/* Banner Image */}
                        <div className="input__field col-span-1 md:col-span-2 lg:col-span-3">
                            <InputFile
                                name={`banners[${index}].image`}
                                label="Banner Image"
                                value={banner.image || null}
                                onChange={(file: File | File[] | null) =>
                                    formik.setFieldValue(`banners[${index}].image`, file)
                                }
                                onBlur={() =>
                                    formik.setFieldTouched(`banners[${index}].image`, true)
                                }
                                serverFile={typeof banner.image_url === "string" ? banner.image_url : ""}
                                // handle remove icon (server file)
                                onRemoveServerFile={() => {
                                    const updatedUSPs = [...formik.values.banners];
                                    updatedUSPs[index] = {
                                        ...updatedUSPs[index],
                                        image_url: "",
                                    };
                                    formik.setFieldValue("banners", updatedUSPs);
                                }}
                            />
                            <span className="error">
                                {formik.touched.banners?.[index]?.image &&
                                    (formik.errors.banners?.[index] as any)?.image
                                    ? (formik.errors.banners?.[index] as any).image
                                    : ""}
                            </span>
                        </div>

                        {/* ✅ Banner / Sub Banner Switch */}
                        <div className="input__field">
                            <FormControlLabel control={<Switch defaultChecked color="primary"
                                checked={banner.type}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    formik.setFieldValue(
                                        `banners[${index}].type`,
                                        e.target.checked
                                    )
                                }
                                name={`banners[${index}].type`}
                            />} label="Mark Sub Banner" sx={{ color: "#000", fontSize: "12px" }} />
                        </div>
                    </div>
                ))}

                <Button
                    variant="text"
                    color="primary"
                    onClick={handleAddBanner}
                    className="!p-0 !text-secondary !text-left hover:!bg-transparent !justify-start"
                >
                    + Add More Banner
                </Button>
            </div>

            <div className="text-right px-10 mb-6 lg:mb-10 flex gap-2 justify-end">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                >
                    Save Banner Setting
                </Button>
            </div>
        </form>
    );
}
