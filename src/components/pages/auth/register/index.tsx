'use client';

import React from 'react'
import AuthMessageBlock from '../authMessageBlock'
import { Box, InputLabel, OutlinedInput } from '@mui/material';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { Formik, useFormik } from 'formik';
import Link from 'next/link';
import { PATH } from '@/routes/PATH';
import { useRegisterUserMutation, useSendVerificationLinkAgainMutation } from '@/services/authApi';
import { useAppDispatch } from '@/hooks/hook';
import { showToast, ToastVariant } from '@/slice/toastSlice';
import PasswordField from '@/components/molecules/PasswordField';
import { ArrowLeft } from '@wandersonalwes/iconsax-react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';

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


const validationSchema = Yup.object().shape({
    emailAddress: Yup.string()
        .email('Must be a valid email')
        .max(255)
        .required('Email is required'),
    displayName: Yup.string()
        .required("Display Name is required")
        .max(14, "Display Name must be less than 14 characters")
        .min(6, "Display Name must be at least 6 characters long")
        .matches(/^\S+$/, "Display Name cannot contain spaces"),
    phone: Yup.string()
        .required("Phone number is required"),
    password: Yup.string()
        .required('Password is required')
        .test(
            'no-leading-trailing-whitespace',
            'Password cannot start or end with spaces',
            (value) => value === value?.trim()
        )
        .max(16, 'Password must be less than 10 characters'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm Password is required'),
    dob: Yup.date()
        .required("Date of birth is required")
        .max(new Date(), 'Date of birth cannot be in the future')
        .test('age', 'You must be at least 21 years old', function (value) {
            if (!value) return true;
            const cutoff = dayjs().subtract(21, 'years');
            return dayjs(value).isBefore(cutoff);
        }),
    first_name: Yup.string().required('First name is required'),
    middle_name: Yup.string(),
    last_name: Yup.string().required('Last name is required'),
    photoid_number: Yup.string(),
    city: Yup.string(),
    pob: Yup.string(),
})

export default function RegisterPage() {
    const [registerUser, { isLoading }] = useRegisterUserMutation();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const initialValues = {
        first_name: '',
        middle_name: '',
        last_name: '',
        emailAddress: "",
        displayName: "",
        password: "",
        confirmPassword: "",
        phone: "",
        photoid_number: '',
        dob: null as Dayjs | null,
        city: '',
        pob: '',
    }
    const { handleSubmit, handleBlur, handleChange, errors, dirty, values, touched, setFieldValue, setFieldTouched } = useFormik(
        {
            initialValues,
            validationSchema,
            onSubmit: async (values) => {
                const formattedDob = values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : '';
                try {
                    const response = await registerUser({
                        email: values.emailAddress,
                        username: values.displayName,
                        password: values.password,
                        password_confirmation: values.confirmPassword,
                        first_name: values.first_name,
                        middle_name: values.middle_name,
                        last_name: values.last_name,
                        phone: values.phone,
                        photoid_number: values.photoid_number,
                        dob: formattedDob,
                        city: values.city,
                        pob: values.pob,
                    }).unwrap();

                    dispatch(
                        showToast({
                            message: response?.data?.message || "User Registerd Successfully",
                            variant: ToastVariant.SUCCESS,
                            autoTime: true,
                        }),
                    );
                    router.replace(`${PATH.AUTH.VERIFY_EMAIL.ROOT}?email=${values.emailAddress}`);
                }
                catch (e: any) {
                    dispatch(
                        showToast({
                            message: e?.data?.message || "Unable to register user. Try again later",
                            variant: ToastVariant.ERROR,
                            autoTime: true,
                        }),
                    );
                }
            }
        }
    )

    return (
        <>
            <AuthMessageBlock
                title="Welcome Back. Ready to rock today?"
                features={["Fun & Fair Gameplay", "Exciting Prizes", "Accessible Anytime, Anywhere", "Trusted & Secure"]}
            />
            <Box className="auth__form__wrapper lg:w-[50%] p-8 max-h-screen overflow-auto">
                <div className="section__title mb-4 lg:mb-6">
                    <Link href={PATH.DASHBOARD.ROOT} className='text-[12px] leading-[120%] font-bold lg:text-[16px] hover:text-primary flex gap-2 items-center'><ArrowLeft />Back to Homepage</Link>
                    <h1 className='text-[24px] leading-[120%] font-bold lg:text-[48px]'>Setup an account</h1>
                </div>

                <form action="" onSubmit={handleSubmit}>
                    <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-x-3 gap-y-5">
                        {/* First Name */}
                        <div className="col-span-2 lg:col-span-2">
                            <div className="input__field">
                                <InputLabel htmlFor="first_name">First Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="first_name"
                                    name="first_name"
                                    placeholder="Enter first name"
                                    value={values.first_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.first_name && errors.first_name}</span>
                            </div>
                        </div>

                        {/* Middle Name */}
                        <div className="col-span-2 lg:col-span-2">
                            <div className="input__field">
                                <InputLabel htmlFor="middle_name">Middle Name</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="middle_name"
                                    name="middle_name"
                                    placeholder="Enter middle name"
                                    value={values.middle_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.middle_name && errors.middle_name}</span>
                            </div>
                        </div>

                        {/* Last Name */}
                        <div className="col-span-2 lg:col-span-2">
                            <div className="input__field">
                                <InputLabel htmlFor="last_name">Last Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="last_name"
                                    name="last_name"
                                    placeholder="Enter last name"
                                    value={values.last_name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.last_name && errors.last_name}</span>
                            </div>
                        </div>

                        {/* EMAIL */}
                        <div className="col-span-2 lg:col-span-6">
                            <div className="input_field">
                                <InputLabel htmlFor="emailAddress">Email Address<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    name='emailAddress'
                                    id='emailAddress'
                                    placeholder='example@example.com'
                                    value={values.emailAddress}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.emailAddress && errors.emailAddress)}
                                />
                                {
                                    touched.emailAddress && errors.emailAddress ?
                                        <span className="error ">{errors.emailAddress}</span> : null
                                }
                            </div>
                        </div>

                        {/* DISPLAY NAME */}
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input_field">
                                <InputLabel htmlFor="displayName">Display Name<span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    name='displayName'
                                    id='displayName'
                                    placeholder='John doe'
                                    value={values.displayName}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={Boolean(touched.displayName && errors.displayName)}
                                />
                                {
                                    touched.displayName && errors.displayName ?
                                        <span className="error ">{errors.displayName}</span> : null
                                }
                            </div>
                        </div>


                        {/* Photo ID */}
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="photoid_number">Photo ID</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="photoid_number"
                                    name="photoid_number"
                                    placeholder="Enter photo ID"
                                    value={values.photoid_number}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.photoid_number && errors.photoid_number}</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="city">City</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="city"
                                    name="city"
                                    placeholder="Enter city"
                                    value={values.city}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.city && errors.city}</span>
                            </div>
                        </div>

                        {/* Country */}
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="pob">Place of Birth</InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="pob"
                                    name="pob"
                                    placeholder="Enter Place of Birth"
                                    value={values.pob}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={formFieldSx}
                                />
                                <span className="error">{touched.pob && errors.pob}</span>
                            </div>
                        </div>



                        <div className="col-span-2 lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="phone">Phone <span className="text-red-500">*</span></InputLabel>
                                <OutlinedInput
                                    fullWidth
                                    id="phone"
                                    name="phone"
                                    placeholder="Enter phone number"
                                    value={values.phone}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <span className="error">
                                    {touched.phone && errors.phone ? errors.phone : ""}
                                </span>
                            </div>
                        </div>
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input__field">
                                <InputLabel htmlFor="dob">Date of Birth <span className="text-red-500">*</span></InputLabel>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DatePicker
                                        value={values.dob}
                                        onChange={(newValue) => {
                                            setFieldValue('dob', newValue);
                                        }}
                                        onClose={() => setFieldTouched('dob', true)}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                id: 'dob',
                                                name: 'dob',
                                                placeholder: 'MM/DD/YYYY',
                                                error: Boolean(touched.dob && errors.dob),
                                                onBlur: handleBlur,
                                                helperText: touched.dob && errors.dob,
                                                sx: formFieldSx
                                            },
                                            popper: {
                                                sx: {
                                                    '& .MuiPickersCalendarHeader-label': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiDayCalendar-weekDayLabel': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root.Mui-selected': {
                                                        backgroundColor: '#B801C0',
                                                    },
                                                    '& .MuiPickersDay-root:hover': {
                                                        backgroundColor: 'rgba(184, 1, 192, 0.3)',
                                                    },
                                                    '& .MuiPickersArrowSwitcher-button': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersCalendarHeader-root': {
                                                        color: '#fff',
                                                    },
                                                    '& .MuiPickersDay-root.MuiPickersDay-today': {
                                                        backgroundColor: '#B801C0',
                                                        border: '1px solid #fff',
                                                        '&:not(.Mui-selected)': {
                                                            backgroundColor: '#B801C0',
                                                        }
                                                    },

                                                }
                                            }
                                        }}
                                        maxDate={dayjs()}
                                        format="MM/DD/YYYY"
                                    />
                                </LocalizationProvider>
                            </div>
                        </div>
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input_field">
                                <PasswordField
                                    name="password"
                                    label="Password"
                                    placeholder="XXXXXXX"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.password ? errors.password : undefined}
                                />
                            </div>
                        </div>
                        <div className="col-span-2 lg:col-span-3">
                            <div className="input_field">
                                <PasswordField
                                    name="confirmPassword"
                                    label="Confirm Password"
                                    placeholder="XXXXXXX"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={touched.confirmPassword ? errors.confirmPassword : undefined}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="action__group text-center flex flex-col gap-4 mt-8">
                        <button className='ss-btn bg-primary-grad' disabled={!dirty}>{isLoading ? "Signing Up" : "Sign up"}</button>
                        <p className='text-[12px] leading-[120%] font-bold lg:text-[16px]'>Already Have an account?</p>
                        <Link href={PATH.AUTH.LOGIN.ROOT} className='ss-btn bg-secondary-grad'>Login</Link>
                    </div>
                </form>

            </Box>
        </>
    )
}
