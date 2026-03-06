"use client";

import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
    Button,
    InputLabel,
    OutlinedInput,
    FormHelperText,
    IconButton,
} from "@mui/material";
import ReactQuillEditor from "@/components/molecules/ReactQuill";
import { pageInitialData } from "@/types/page"; // should match your type
import { CloseCircle } from "@wandersonalwes/iconsax-react";
import { useCreatePageMutation, useGetSinlgePageByIdQuery, useUpdatePageByIdMutation } from "@/services/pageApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { useAppDispatch } from "@/hooks/hook";
import { useRouter } from "next/navigation";

export default function AddPageForm({ id }: { id?: string }) {
    const [createPage, { isLoading: creatingPage }
    ] = useCreatePageMutation();
    const { data, isLoading } = useGetSinlgePageByIdQuery({ id }, {
        skip: !id
    })
    const [updatedPage, { isLoading: updating }] = useUpdatePageByIdMutation();

    const dispatch = useAppDispatch();
    const router = useRouter();
    const formik = useFormik({
        initialValues: id ? {
            name: data?.data?.name || "",
            slug: data?.data?.slug || "",
            description: data?.data?.description || "",
            content: data?.data?.content || [{
                description: "",
                heading: "",
            }]
        } : pageInitialData,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required("Page title is required"),
            slug: Yup.string().required("Slug is required"),
            description: Yup.string().required("Description is required"),
            content: Yup.array().of(
                Yup.object({
                    heading: Yup.string().required("Heading is required"),
                    description: Yup.string().required("Description cannot be empty"),
                })
            ),
        }),
        onSubmit: async (values) => {

            if (!values.content) {
                console.error("❌ content is undefined in form values");
                return;
            }

            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("slug", values.slug);
            formData.append("description", values.description);

            values.content.forEach((item, index) => {
                formData.append(`content[${index}][heading]`, item.heading);
                formData.append(`content[${index}][description]`, item.description);
            });



            if (id) {
                try {
                    const response = await updatedPage({ id, body: formData }).unwrap();
                    dispatch(
                        showToast({
                            message: response.message || "Page created successfully",
                            variant: ToastVariant.SUCCESS
                        })
                    );
                    router.push("/pages");
                } catch (e: any) {
                    console.error("Error submitting form:", e);
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Something went wrong",
                            variant: ToastVariant.ERROR
                        })
                    );
                }
            }
            else {
                try {
                    const response = await createPage(formData).unwrap();
                    dispatch(
                        showToast({
                            message: response.message || "Page created successfully",
                            variant: ToastVariant.SUCCESS
                        })
                    );
                    router.push("/pages");
                } catch (e: any) {
                    console.error("Error submitting form:", e);
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Something went wrong",
                            variant: ToastVariant.ERROR
                        })
                    );
                }
            }
        }

    });

    const [slugTouchedManually, setSlugTouchedManually] = useState(false);


    useEffect(() => {
        if (!slugTouchedManually) {
            const generatedSlug = formik.values.name
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            formik.setFieldValue("slug", generatedSlug);
        }
    }, [formik.values.name]);

    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSlugTouchedManually(true);
        formik.handleChange(e);
    };

    const handleAddPageContent = () => {
        formik.setFieldValue("content", [
            ...formik.values.content,
            { heading: "", description: "" },
        ]);
    };

    const handleRemovePageContent = (index: number) => {
        const updated = [...formik.values.content];
        updated.splice(index, 1);
        formik.setFieldValue("content", updated);
    };

    return (
        <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="input__field">
                <InputLabel>
                    Page Title <span className="text-red-500">*</span>
                </InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Page Title"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                />
                {formik.touched.name && formik.errors.name && (
                    <FormHelperText error>{formik.errors.name}</FormHelperText>
                )}
            </div>

            {/* Slug */}
            <div className="input__field">
                <InputLabel>
                    Slug <span className="text-red-500">*</span>
                </InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Page Slug"
                    name="slug"
                    value={formik.values.slug}
                    onChange={handleSlugChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.slug && Boolean(formik.errors.slug)}
                />
                {formik.touched.slug && formik.errors.slug && (
                    <FormHelperText error>{formik.errors.slug}</FormHelperText>
                )}
            </div>

            {/* Description */}
            <div className="input__field">
                <InputLabel>
                    Page Description [Excert] <span className="text-red-500">*</span>
                </InputLabel>
                <OutlinedInput
                    fullWidth
                    placeholder="Excert"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                />
                {formik.touched.description && formik.errors.description && (
                    <FormHelperText error>{formik.errors.description}</FormHelperText>
                )}
            </div>



            {/* Dynamic Content */}
            <InputLabel className="mb-2">Page Content</InputLabel>
            {formik.values.content.map((item, i) => (
                <div className="space-y-6" key={`content-${i}`}>
                    <div

                        className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start border border-gray-200 p-4 rounded-lg relative"
                    >
                        {/* Heading */}
                        <div className="lg:col-span-4">
                            <OutlinedInput
                                fullWidth
                                placeholder="Heading"
                                name={`content[${i}].heading`}
                                value={item.heading}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={
                                    !!(
                                        formik.touched.content?.[i]?.heading &&
                                        (formik.errors.content?.[i] as any)?.heading
                                    )
                                }
                            />
                            {formik.touched.content?.[i]?.heading &&
                                (formik.errors.content?.[i] as any)?.heading && (
                                    <FormHelperText error>
                                        {(formik.errors.content?.[i] as any)?.heading}
                                    </FormHelperText>
                                )}
                        </div>

                        {/* Description */}
                        <div className="lg:col-span-8">
                            <ReactQuillEditor
                                key={`${i}-${formik.values.content.length}`}
                                value={item.description}
                                onChange={(val: string) =>
                                    formik.setFieldValue(`content[${i}].description`, val)
                                }
                            />
                            {formik.touched.content?.[i]?.description &&
                                (formik.errors.content?.[i] as any)?.description && (
                                    <FormHelperText error>
                                        {(formik.errors.content?.[i] as any)?.description}
                                    </FormHelperText>
                                )}
                        </div>

                        {/* Remove Button */}
                        {formik.values.content.length > 1 && <div className="absolute right-[-12px] top-[-6px]">
                            <IconButton
                                color="error"
                                onClick={() => handleRemovePageContent(i)}
                            >
                                <CloseCircle />
                            </IconButton>
                        </div>}
                    </div>
                </div>
            ))}


            {/* Buttons */}
            <div className="flex gap-3">
                <Button
                    variant="contained"
                    color="primary"
                    type="button"
                    onClick={handleAddPageContent}
                >
                    Add More Content
                </Button>
                <Button type="submit" variant="contained" color="secondary" disabled={!formik.dirty}>
                    Save Page Content
                </Button>
            </div>
        </form>
    );
}
