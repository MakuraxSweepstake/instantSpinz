"use client";
import { useAppSelector } from "@/hooks/hook";
import { Box, Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const AGE_COOKIE_KEY = "age_verified";
const ONE_DAY = 24 * 60 * 60;

export default function AgeVerificationModal() {
    const user = useAppSelector((state) => state.auth.user);
    const [open, setOpen] = useState(false);

    const setAgeCookie = () => {
        document.cookie = `${AGE_COOKIE_KEY}=true; max-age=${ONE_DAY}; path=/; SameSite=Lax`;
    };

    const getAgeCookie = () => {
        return document.cookie
            .split("; ")
            .find((row) => row.startsWith(`${AGE_COOKIE_KEY}=`));
    };

    useEffect(() => {
        const ageVerified = getAgeCookie();


        setOpen(!user && !ageVerified);
    }, [user]);

    const handleConfirmAge = () => {
        setAgeCookie();
        setOpen(false);
    };

    const handleCancel = () => {
        window.location.href = "about:blank";
    };

    return (
        <Dialog
            open={open}
            disableEscapeKeyDown
            disableScrollLock
            keepMounted={false}
            aria-labelledby="age-verification-dialog"
            sx={{
                pointerEvents: open ? "auto" : "none",
                "& .MuiBackdrop-root": {
                    backdropFilter: "blur(8px)",
                    backgroundColor: "rgba(0, 0, 0, 0.4)",
                },
            }}
        >
            <DialogContent>
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Age Verification Required
                </Typography>

                <Typography mb={2}>
                    This site is restricted to users who are 21 years of age or older.
                    Please confirm your age to proceed.
                </Typography>

                <Typography variant="body2" mb={3}>
                    By clicking "I am over 21", you confirm that you meet the minimum age requirement.
                </Typography>

                <Box display="flex" gap={1} justifyContent="flex-end">
                    <Button variant="outlined" color="secondary" onClick={handleCancel}>
                        I am under 21
                    </Button>
                    <Button variant="contained" onClick={handleConfirmAge}>
                        I am over 21
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
}
