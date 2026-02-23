import { MasspayPaymentFields } from "@/types/transaction";
import { FormControl, FormHelperText, InputLabel, MenuItem, OutlinedInput, Select } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { FormikProps } from "formik";
import { validateDynamicField } from ".";

interface RenderFieldsProps {
    field: MasspayPaymentFields;
    formik: FormikProps<any>;
    disabled?: boolean;
}

export const RenderFields = ({ field, formik, disabled }: RenderFieldsProps) => {
    const fieldIndex = formik.values.payment_fields?.findIndex(
        (f: MasspayPaymentFields) => f.token === field.token
    );

    const fieldValue = fieldIndex !== -1
        ? formik.values.payment_fields[fieldIndex]?.value || ""
        : "";

    // Get error from the payment_fields error object
    const errorFields = formik.errors.payment_fields as Record<string, string> | undefined;
    const fieldError = errorFields?.[field.token];

    const handleChange = (value: string | Dayjs | null) => {
        let formattedValue = value;

        if (field.input_type === "date" && field.type !== "CardExpiration" && value) {
            formattedValue = dayjs(value as Dayjs).format("YYYY-MM-DD");
        }

        if (fieldIndex !== -1) {
            const updatedFields = [...formik.values.payment_fields];
            updatedFields[fieldIndex] = {
                ...updatedFields[fieldIndex],
                value: formattedValue as string
            };
            formik.setFieldValue('payment_fields', updatedFields);
        }

        // Clear error for this field if it exists
        if (errorFields?.[field.token]) {
            const newErrors = { ...errorFields };
            delete newErrors[field.token];
            formik.setErrors({
                ...formik.errors,
                payment_fields: Object.keys(newErrors).length > 0 ? newErrors : undefined
            });
        }
    };

    const handleBlur = () => {
        const currentField = formik.values.payment_fields[fieldIndex];
        const error = validateDynamicField(currentField, currentField?.value);

        if (error) {
            formik.setErrors({
                ...formik.errors,
                payment_fields: {
                    ...(formik.errors.payment_fields as Record<string, string> || {}),
                    [field.token]: error
                }
            });
        }
    };

    const getOptions = (): string[] => {
        if (field.input_type === "options" && field.validation) {
            return field.validation.split("|");
        }
        return [];
    };

    switch (field.input_type) {
        case "text":
            return (
                <div className="input__field text-left">
                    <InputLabel>{field.label} <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        disabled={disabled}
                        fullWidth
                        id={field.token}
                        name={`payment_fields.${field.token}`}
                        value={fieldValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        error={Boolean(fieldError)}
                        placeholder={field.expected_value}
                    />
                    {fieldError && (
                        <FormHelperText error>{fieldError}</FormHelperText>
                    )}
                </div>
            );

        case "options":
            const options = getOptions();
            return (
                <div className="input__field text-left">
                    <InputLabel>{field.label} <span className="text-red-500">*</span></InputLabel>
                    <FormControl fullWidth error={Boolean(fieldError)}>
                        <Select
                            disabled={disabled}
                            id={field.token}
                            name={`payment_fields.${field.token}`}
                            value={fieldValue}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select {field.label}
                            </MenuItem>
                            {options.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                        {fieldError && (
                            <FormHelperText>{fieldError}</FormHelperText>
                        )}
                    </FormControl>
                </div>
            );

        case "date":
            if (field.type === "CardExpiration") {
                return (
                    <div className="input__field text-left">
                        <InputLabel>{field.label} <span className="text-red-500">*</span></InputLabel>
                        <OutlinedInput
                            disabled={disabled}

                            fullWidth
                            id={field.token}
                            name={`payment_fields.${field.token}`}
                            value={fieldValue}
                            onChange={(e) => handleChange(e.target.value)}
                            onBlur={handleBlur}
                            error={Boolean(fieldError)}
                            placeholder={field.expected_value}
                        />
                        {fieldError && (
                            <FormHelperText error>{fieldError}</FormHelperText>
                        )}
                    </div>
                )
            }
            else {
                return (
                    <div className="input__field text-left">
                        <InputLabel>{field.label} <span className="text-red-500">*</span></InputLabel>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                disabled={disabled}
                                value={fieldValue ? dayjs(fieldValue) : null}
                                onChange={(newValue) => handleChange(newValue)}
                                onClose={handleBlur}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        id: field.token,
                                        name: `payment_fields.${field.token}`,
                                        placeholder: field.expected_value || "YYYY-MM-DD",
                                        error: Boolean(fieldError),
                                        onBlur: handleBlur,
                                        helperText: fieldError || "",
                                        sx: {
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
                                        }
                                    },
                                    popper: {
                                        sx: {
                                            "& .MuiPickersCalendarHeader-label": {
                                                color: "#fff",
                                            },
                                            "& .MuiDayCalendar-weekDayLabel": {
                                                color: "#fff",
                                            },
                                            "& .MuiPickersDay-root": {
                                                color: "#fff",
                                            },
                                            "& .MuiPickersDay-root.Mui-selected": {
                                                backgroundColor: "#B801C0",
                                            },
                                            "& .MuiPickersDay-root:hover": {
                                                backgroundColor: "rgba(184, 1, 192, 0.3)",
                                            },
                                            "& .MuiPickersArrowSwitcher-button": {
                                                color: "#fff",
                                            },
                                            "& .MuiPickersCalendarHeader-root": {
                                                color: "#fff",
                                            },
                                            "& .MuiPickersDay-root.MuiPickersDay-today": {
                                                backgroundColor: "#B801C0",
                                                border: "1px solid #fff",
                                                "&:not(.Mui-selected)": {
                                                    backgroundColor: "#B801C0",
                                                },
                                            },
                                        },
                                    },
                                }}
                                maxDate={dayjs()}
                                format="YYYY-MM-DD"
                            />
                        </LocalizationProvider>
                    </div>
                );
            }

        default:
            return (
                <div className="input__field text-left">
                    <InputLabel>{field.label} <span className="text-red-500">*</span></InputLabel>
                    <OutlinedInput
                        disabled={disabled}
                        fullWidth
                        id={field.token}
                        name={`payment_fields.${field.token}`}
                        value={fieldValue}
                        onChange={(e) => handleChange(e.target.value)}
                        onBlur={handleBlur}
                        error={Boolean(fieldError)}
                        placeholder={field.expected_value}
                    />
                    {fieldError && (
                        <FormHelperText error>{fieldError}</FormHelperText>
                    )}
                </div>
            );
    }
};