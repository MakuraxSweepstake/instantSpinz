"use client";

import { IconButton, InputAdornment, InputLabel, OutlinedInput } from "@mui/material";
import { Eye, EyeSlash } from "@wandersonalwes/iconsax-react";
import { useState } from "react";

interface PasswordFieldProps {
    label: string;
    name: string;
    placeholder?: string;
    value: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    onBlur: React.FocusEventHandler<HTMLInputElement>;
    error?: string;
    required?: boolean;
}

export default function PasswordField({
    label,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    required = false,
}: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);
    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault();
    return (
        <div className="input_field">
            <InputLabel htmlFor={name}>{label} {required && <span className="text-red-500">*</span>}</InputLabel>
            <OutlinedInput
                id={name}
                name={name}
                type={showPassword ? 'text' : 'password'}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                endAdornment={
                    < InputAdornment position="end" >
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                            color="secondary"
                        // sx={{
                        //     padding: 0,
                        // }}
                        >
                            {showPassword ? <Eye size={16} /> : <EyeSlash size={16} />}
                        </IconButton>
                    </InputAdornment >
                }
            />
            {error ? <span className="error">{error}</span> : null}
        </div>
    );
}


