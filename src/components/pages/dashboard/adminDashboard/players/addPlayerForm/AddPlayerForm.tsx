"use client";
import InputFile from '@/components/atom/InputFile';
import PasswordField from '@/components/molecules/PasswordField';
import { US_STATES } from '@/constants/state';
import { PlayerProps, SinlgePlayerResponseProps } from '@/types/player';
import { Button, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { FormikProps } from 'formik';

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

export default function AddPlayerForm({ formik, id, data, loading, buttonLabel }: { formik: FormikProps<PlayerProps>, id?: string, data?: SinlgePlayerResponseProps, loading?: boolean, buttonLabel?: string }) {

    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="form__fields p-6 lg:p-10 flex flex-col gap-4 lg:gap-6 lg:grid grid-cols-2">
                <div className="input__field">
                    <InputLabel htmlFor="name">Username<span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="name"
                        name="name"
                        type="name"
                        placeholder="Enter Username"
                        value={formik.values.name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.name && formik.errors.name ? formik.errors.name : ""}
                    </span>
                </div>
                <div className="input__field">
                    <InputLabel htmlFor="email">Email<span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter email address"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.email && formik.errors.email ? formik.errors.email : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="first_name">First Name<span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="first_name"
                        name="first_name"
                        placeholder="Enter first name"
                        value={formik.values.first_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.first_name && formik.errors.first_name ? formik.errors.first_name : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="last_name">Last Name<span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="last_name"
                        name="last_name"
                        placeholder="Enter last name"
                        value={formik.values.last_name}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.last_name && formik.errors.last_name ? formik.errors.last_name : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="wallet_address">Wallet Address</InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="wallet_address"
                        name="wallet_address"
                        placeholder="Enter wallet address"
                        value={formik.values.wallet_address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.wallet_address && formik.errors.wallet_address ? formik.errors.wallet_address : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="address">Address <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="address"
                        name="address"
                        placeholder="Enter address"
                        value={formik.values.address}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.address && formik.errors.address ? formik.errors.address : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="city">City <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="city"
                        name="city"
                        placeholder="Enter city"
                        value={formik.values.city}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.city && formik.errors.city ? formik.errors.city : ""}
                    </span>
                </div>

                <div className="input__field">
                    <InputLabel htmlFor="phone">Phone <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="phone"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                    </span>
                </div>


                <div className="input__field">
                    <InputLabel htmlFor="pob">State</InputLabel>

                    <Select
                        fullWidth
                        id="pob"
                        name="pob"
                        displayEmpty
                        value={formik.values.pob}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        sx={formFieldSx}
                        renderValue={(selected) =>
                            selected === "" ? "Select a State" : selected
                        }
                    >
                        <MenuItem value="">
                            <em>Select a State</em>
                        </MenuItem>
                        {US_STATES.map((state) => (
                            <MenuItem key={state.value} value={state.value}>
                                {state.label}
                            </MenuItem>
                        ))}
                    </Select>

                    <span className="error">{formik.touched.pob && formik.errors.pob}</span>
                </div>
                <div className="input__field">
                    <InputLabel htmlFor="zip_code">Zip Code <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        fullWidth
                        id="zip_code"
                        name="zip_code"
                        placeholder="Enter zip code"
                        value={formik.values.zip_code}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    <span className="error">
                        {formik.touched.phone && formik.errors.phone ? formik.errors.phone : ""}
                    </span>
                </div>

                {/* DOB */}
                <div className="input__field">
                    <InputLabel htmlFor="dob">Date of Birth <span className="text-red-500">*</span></InputLabel>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            value={formik.values.dob ? dayjs(formik.values.dob) : null}
                            onChange={(newValue) => {
                                formik.setFieldValue('dob', newValue);
                            }}
                            onClose={() => formik.setFieldTouched('dob', true)}
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    id: 'dob',
                                    name: 'dob',
                                    placeholder: 'MM/DD/YYYY',
                                    error: Boolean(formik.touched.dob && formik.errors.dob),
                                    onBlur: formik.handleBlur,
                                    helperText: formik.touched.dob && formik.errors.dob,
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

                <div className="input__field">
                    <PasswordField
                        required={id ? false : true}
                        name="password"
                        label="Password*"
                        placeholder="Enter password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password ? formik.errors.password : undefined}
                    />
                </div>

                <div className="input__field">
                    <PasswordField
                        required={id ? false : true}
                        name="password_confirmation"
                        label="Confirm Password"
                        placeholder="Confirm password"
                        value={formik.values.password_confirmation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password_confirmation ? formik.errors.password_confirmation : undefined}
                    />
                </div>

                <div className="input__field">
                    <InputFile
                        name="profile_image"
                        label="Profile Image"
                        value={formik.values.profile_image || null}
                        onChange={(file: File | File[] | null) => formik.setFieldValue("profile_image", file)}
                        onBlur={() => formik.setFieldTouched("profile_image", true)}
                        serverFile={data?.data?.profile_image_file}
                    />
                    <span className="error">
                        {formik.touched.profile_image && formik.errors.profile_image ? formik.errors.profile_image : ""}
                    </span>
                </div>

            </div>
            <div className="text-end mb-4 lg:mb-8 max-w-fit ml-auto flex justify-end gap-4 px-10">
                {/* {id ? <Button color='error' variant='contained' onClick={() => {
                    router.push(PATH.ADMIN.PLAYERS.ROOT)
                }}>Cancel Player Edit</Button> : null} */}
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ color: "#fff" }} >
                    {!loading ? `${buttonLabel ? buttonLabel : `Confirm ${id ? "Player Update" : "Player Addition"}`}` : "Updating"}
                </Button>
            </div>
        </form>
    )
}
