"use client";
import InputFile from "@/components/atom/InputFile";
import SelectField from "@/components/atom/SelectField";
import ReactQuillEditor from "@/components/molecules/ReactQuill";
import { useAppDispatch } from "@/hooks/hook";
import { PATH } from "@/routes/PATH";
import { useAddGameMutation, useGetGameByIdQuery, useUpdateGameByIdMutation } from "@/services/gameApi";
import { useGetAllProviderQuery } from "@/services/providerApi";
import { showToast, ToastVariant } from "@/slice/toastSlice";
import { gameInitialValues, GameProps } from "@/types/game";
import { Button, InputLabel, Input, OutlinedInput } from "@mui/material";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import React from "react";
import * as Yup from "yup";

interface AddGameFormProps {
    id?: string
}

const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    category: Yup.string().required("Category is required"),
    description: Yup.string().required("Description is required"),
    // thumbnail: Yup.mixed().required("Thumbnail is required"),
    api: Yup.string().required("API is required"),
    provider: Yup.string().required("Provider is required"),
});

export default function AddGameForm({ id }: AddGameFormProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { data: gameProviders, isLoading } = useGetAllProviderQuery();
    const [addGame, { isLoading: addingGame }] = useAddGameMutation();
    const { data, isLoading: loadingGameData } = useGetGameByIdQuery({ id: Number(id) }, { skip: !id })
    const [updateGame, { isLoading: editing }] = useUpdateGameByIdMutation();

    const [serverFiles, setServerFiles] = React.useState<{
        thumbnail: string | null;
        screenshots: string[];
        subgames: string[];
    }>({
        thumbnail: data?.data.thumbnail || null,
        screenshots: data?.data.screenshots || [],
        subgames: data?.data.subgames || [],
    });


    React.useEffect(() => {
        setServerFiles({
            screenshots: data?.data?.screenshots || [],
            subgames: data?.data?.subgames || [],
            thumbnail: data?.data?.thumbnail || "",
        })
    }, [data])

    const formik = useFormik<GameProps>({
        initialValues: data ? {
            name: data.data?.name,
            category: data.data?.category,
            description: data.data?.description,
            thumbnail: null,
            screenshots: [],
            subgames: [],
            api: data.data?.api,
            provider: data.data?.provider,
            profit: data.data?.profit,
        } : gameInitialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("category", values.category || "");
            formData.append("description", values.description);
            formData.append("api", values.api);
            formData.append("provider", values.provider);
            if (values.profit) formData.append("profit", values.profit);

            if (values.thumbnail instanceof File) {
                formData.append("thumbnail", values.thumbnail);
            }

            if (values.screenshots && Array.isArray(values.screenshots)) {
                values.screenshots.forEach((file, index) => {
                    formData.append(`screenshots[${index}]`, file);
                });
            }

            if (values.subgames && Array.isArray(values.subgames)) {
                values.subgames.forEach((file, index) => {
                    formData.append(`subgames[${index}]`, file);
                });
            }

            if (id) {
                if (serverFiles.subgames && Array.isArray(serverFiles.subgames)) {
                    serverFiles.subgames.forEach((file, index) => {
                        formData.append(`subgames_files[${index}]`, file);
                    });
                }
            }
            if (id) {
                if (serverFiles.screenshots && Array.isArray(serverFiles.screenshots)) {
                    serverFiles.screenshots.forEach((file, index) => {
                        formData.append(`screenshots_files[${index}]`, file);
                    });
                }
            }

            if (id) {
                const response = await updateGame({ id: id, body: formData }).unwrap();
                dispatch(
                    showToast({
                        message: response.message,
                        variant: ToastVariant.SUCCESS
                    })
                )
                router.push(PATH.ADMIN.GAMES.ROOT)
            }
            else {
                try {
                    const response = await addGame(formData).unwrap();
                    dispatch(
                        showToast({
                            message: response.message,
                            variant: ToastVariant.SUCCESS
                        })
                    )
                    router.push(PATH.ADMIN.GAMES.ROOT)
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message,
                            variant: ToastVariant.ERROR
                        })
                    )
                }
            }
        },
    });

    const handleServerFileRemoval = (field: "screenshots" | "subgames" | "thumbnail", fileUrl?: string) => {
        if (field === "thumbnail") {
            setServerFiles((prev) => ({ ...prev, thumbnail: null }));
        } else {
            setServerFiles((prev) => ({
                ...prev,
                [field]: prev[field].filter((f: string) => f !== fileUrl),
            }));
        }
    };


    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form__field__wrapper border-solid border-[1px] border-gray rounded-[16px] mb-6">
                <div className="form__title py-6 px-10 border-b-solid border-b-[1px] border-gray">
                    <h2 className="text-[20px] leading-[140%] font-bold">Overview of the Game</h2>
                </div>

                <div className="form__fields p-6 lg:p-10 flex flex-col gap-4 lg:gap-6 ">
                    {/* Name */}
                    <div className="input__field">
                        <InputLabel htmlFor="name">Name of the Game<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="name"
                            name="name"
                            placeholder="Enter the name of the game"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                        </span>
                    </div>

                    {/* Thumbnail */}
                    <div className="input__field">
                        <InputFile
                            name="thumbnail"
                            label="Thumbnail of the Game"
                            value={formik.values.thumbnail || null}
                            onChange={(file: File | File[] | null) => formik.setFieldValue("thumbnail", file)}
                            onBlur={() => formik.setFieldTouched("thumbnail", true)}
                            serverFile={serverFiles.thumbnail}
                            onRemoveServerFile={() => handleServerFileRemoval("thumbnail")}
                        />
                        <span className="error">
                            {formik.touched.thumbnail && formik.errors.thumbnail ? formik.errors.thumbnail : ""}
                        </span>
                    </div>

                    {/* Category */}
                    <div className="input__field">
                        <SelectField
                            name="category"
                            label="Game Category"
                            value={formik.values.category || ""}
                            onChange={(e) => formik.setFieldValue("category", e.target.value)}
                            onBlur={() => formik.setFieldTouched("category", true)}
                            required
                            options={[
                                { value: "action", name: "Action" },
                                { value: "adventure", name: "Adventure" },
                                { value: "puzzle", name: "Puzzle" },
                            ]}
                        />
                        <span className="error">
                            {formik.touched.category && formik.errors.category ? formik.errors.category : ""}
                        </span>
                    </div>

                    {/* Description */}
                    <div className="input__field">
                        <InputLabel>Game Description<span className="text-red-500">*</span></InputLabel>
                        <ReactQuillEditor
                            value={formik.values.description}
                            onChange={(val: string) => formik.setFieldValue("description", val)}
                        />
                        <span className="error">
                            {formik.touched.description && formik.errors.description ? formik.errors.description : ""}
                        </span>
                    </div>

                    {/* Screenshots */}
                    <div className="input__field">
                        <InputFile
                            name="screenshots"
                            label="Screenshots of the game"
                            multiple={true}
                            value={formik.values.screenshots || []}
                            onChange={(files: File | File[] | null) => {
                                if (Array.isArray(files)) {
                                    formik.setFieldValue("screenshots", files);
                                } else if (files === null) {
                                    formik.setFieldValue("screenshots", []);
                                } else {
                                    // Single file converted to array
                                    formik.setFieldValue("screenshots", [files]);
                                }
                            }
                            }
                            onBlur={() => formik.setFieldTouched("screenshots", true)}
                            serverFile={serverFiles.screenshots}
                            onRemoveServerFile={(fileUrl) => handleServerFileRemoval("screenshots", fileUrl)}
                        />
                    </div>

                    {/* Subgames */}
                    <div className="input__field">
                        <InputFile
                            name="subgames"
                            label="Display Images of Sub Games"
                            multiple={true}
                            value={formik.values.subgames || []}
                            onChange={(files: File | File[] | null) => {
                                if (Array.isArray(files)) {
                                    formik.setFieldValue("subgames", files);
                                } else if (files === null) {
                                    formik.setFieldValue("subgames", []);
                                } else {
                                    formik.setFieldValue("subgames", [files]);
                                }
                            }
                            }
                            onBlur={() => formik.setFieldTouched("subgames", true)}
                            serverFile={serverFiles.subgames}
                            onRemoveServerFile={(fileUrl) => handleServerFileRemoval("subgames", fileUrl)}
                        />
                    </div>
                </div>
            </div>

            {/* Game Configuration */}
            <div className="form__field__wrapper border-solid border-[1px] border-gray rounded-[16px]">
                <div className="form__title py-6 px-10 border-b-solid border-b-[1px] border-gray">
                    <h2 className="text-[20px] leading-[140%] font-bold">Game Configuration</h2>
                </div>

                <div className="form__fields p-6 lg:p-10 flex flex-col gap-4 lg:gap-6 lg:grid grid-cols-3">
                    {/* API */}
                    <div className="input__field">
                        <InputLabel>API<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="api"
                            name="api"
                            placeholder="Enter the API"
                            value={formik.values.api}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.api && formik.errors.api ? formik.errors.api : ""}
                        </span>
                    </div>

                    {/* Provider */}
                    <div className="input__field">
                        <SelectField
                            name="provider"
                            label="Provider"
                            value={formik.values.provider || ""}
                            onChange={(e) => formik.setFieldValue("provider", e.target.value)}
                            onBlur={() => formik.setFieldTouched("provider", true)}
                            required={true}
                            options={
                                !isLoading && gameProviders
                                    ? gameProviders.data.map((provider: any) => ({
                                        id: provider.id,
                                        value: provider.slug || provider.value, // choose what your API gives
                                        name: provider.name,
                                    }))
                                    : []
                            }
                        />
                        <span className="error">
                            {formik.touched.provider && formik.errors.provider ? formik.errors.provider : ""}
                        </span>
                    </div>

                    {/* Extra Thumbnail */}
                    <div className="input__field">
                        <InputLabel htmlFor="profit">Profit % for Superadmin (you)<span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            fullWidth
                            id="profit"
                            name="profit"
                            placeholder="Enter the profit percentage"
                            value={formik.values.profit}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                        />
                        <span className="error">
                            {formik.touched.profit && formik.errors.profit ? formik.errors.profit : ""}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit */}
            <div className="text-end mt-8 lg:mt-12 max-w-fit ml-auto">
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={!formik.dirty || formik.isSubmitting || addingGame || editing}
                >
                    {addingGame || editing
                        ? id
                            ? "Updating..."
                            : "Adding..."
                        : `Confirm ${id ? "Update" : "Addition"}`}
                </Button>

            </div>
        </form>
    );
}
