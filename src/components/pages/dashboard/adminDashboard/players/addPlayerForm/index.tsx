"use client"

import { useAppDispatch } from '@/hooks/hook'
import { useCreatePlayerMutation, useGetPlayerByIdQuery, useUpdatePlayerByIdMutation } from '@/services/playerApi'
import { showToast, ToastVariant } from '@/slice/toastSlice'
import { initialPlayerValues } from '@/types/player'
import dayjs from 'dayjs'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import * as Yup from "yup"
import AddPlayerForm from './AddPlayerForm'

export const PlayerValidationSchema = (isEdit: boolean) => Yup.object().shape({
    name: Yup.string().required("Username is required"),
    email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
    first_name: Yup.string().required("First name is required"),
    last_name: Yup.string().required("Last name is required"),
    wallet_address: Yup.string().nullable(),
    address: Yup.string().required("Address is required"),
    city: Yup.string().required("City is required"),
    zip_code: Yup.string().required("Zip code is required"),
    pob: Yup.string().required("State is required"),
    phone: Yup.string()
        .matches(/^\+?\d{7,15}$/, "Invalid phone number")
        .required("Phone is required"),
    password: isEdit
        ? Yup.string().nullable() // not required in edit mode
        : Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    password_confirmation: Yup.string().when("password", {
        is: (val: string) => !!val, // required only if password is filled
        then: (schema) => schema.oneOf([Yup.ref("password")], "Passwords must match").required("Password confirmation is required"),
        otherwise: (schema) => schema.nullable(),
    }),
    dob: Yup.date()
        .required("Date of birth is required")
        .max(new Date(), 'Date of birth cannot be in the future')
        .test('age', 'You must be at least 21 years old', function (value) {
            if (!value) return true;
            const cutoff = dayjs().subtract(21, 'years');
            return dayjs(value).isBefore(cutoff);
        }),
    // profile_image: Yup.mixed().required("Profile is required"),
});
export default function AddPlayerPage({ id }: { id?: string }) {

    const dispatch = useAppDispatch();
    const router = useRouter();

    const [createPlayer, { isLoading }] = useCreatePlayerMutation();
    const [updatePlayer, { isLoading: updating }] = useUpdatePlayerByIdMutation();
    const { data, isLoading: loadingPlayer } = useGetPlayerByIdQuery(
        id ? { id } : ({} as any),
        { skip: !id }
    );

    const formik = useFormik({
        initialValues: data ? {
            name: data?.data.name,
            email: data?.data.email,
            first_name: data?.data.first_name,
            last_name: data?.data.last_name,
            wallet_address: data?.data.wallet_address,
            address: data?.data.address,
            city: data?.data.city,
            phone: data?.data.phone || "",
            password: data?.data.password,
            password_confirmation: data?.data.password_confirmation,
            profile_image: null,
        } : initialPlayerValues,
        validationSchema: PlayerValidationSchema(!!id),
        enableReinitialize: true,
        onSubmit: async (values) => {
            const formData = new FormData();
            formData.append("name", values.name);
            formData.append("email", values.email);
            formData.append("first_name", values.first_name);
            formData.append("last_name", values.last_name);
            formData.append("password", values.password);
            formData.append("password_confirmation", values.password_confirmation);
            if (values.wallet_address) formData.append("wallet_address", values.wallet_address);
            if (values.address) formData.append("address", values.address);
            if (values.city) formData.append("city", values.city);
            if (values.phone) formData.append("phone", values.phone);
            if (values.dob) formData.append("dob", values.dob.toString());
            if (values.zip_code) formData.append("zip_code", values.zip_code);
            if (values.pob) formData.append("pob", values.pob);
            if (values.profile_image) {
                if (Array.isArray(values.profile_image)) {
                    values.profile_image.forEach((file) => formData.append("profile_image", file));
                } else {
                    formData.append("profile_image", values.profile_image);
                }
            }

            if (id && data) {
                formData.append("profile_image_file", data?.data?.profile_image_file || "");
            }

            if (id) {
                try {
                    const response = await updatePlayer({ id: id, body: formData });
                    dispatch(
                        showToast({
                            message: response?.data?.message || "User Updated Successfully",
                            variant: ToastVariant.SUCCESS
                        })
                    );

                    router.push("/players");
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e.error || e.data.message,
                            variant: ToastVariant.ERROR
                        })
                    )
                }
            }
            else {
                try {
                    const response = await createPlayer(formData).unwrap();
                    dispatch(
                        showToast({
                            message: response.message,
                            variant: ToastVariant.SUCCESS
                        })
                    );
                    router.push("/players");
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e.data.message,
                            variant: ToastVariant.ERROR
                        })
                    )
                }
            }
        }
    })
    return (
        <div className="form__field__wrapper border-solid border-[1px] border-gray rounded-[16px] mb-6 ">
            <div className="form__title py-6 px-10 border-b-solid border-b-[1px] border-gray">
                <h2 className="text-[20px] leading-[140%] font-bold">Player Details</h2>
            </div>

            <AddPlayerForm formik={formik} id={id} data={data} loading={isLoading || updating} />
        </div>
    )
}
