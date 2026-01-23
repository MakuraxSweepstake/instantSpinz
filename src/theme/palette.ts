// src/theme/Palette.ts
import { createTheme, PaletteMode } from "@mui/material/styles";
import { ThemeMode } from "@/config";
import { PaletteThemeProps } from "@/types/theme";

export default function Palette(mode: ThemeMode) {
    const contrastText = "#fff";

    let primaryColors = ["#71717A", "#B801C0", "#3A013F"];
    let secondaryColors = ["#93E0D8", "#69A29D", "#4A7D78"];
    let grayColors = ["#E0E0E3", "#F3F4F6"];
    let titleColors = [
        "#0E0E11",
        "rgba(0, 0, 0, 0.80)",
        "rgba(0, 0, 0, 0.90)",
    ];
    let primaryGradColors = [
        "linear-gradient(90deg, #B100B8 0%, #F335ED 100%)",
    ];
    let secondaryGradColors = [
        "linear-gradient(90deg, #69A29D 0%, #93E0D9 100%)",
    ];

    if (mode === ThemeMode.DARK) {
        primaryColors = ["#A0A0A7", "#D958DF", "#7D0182"];
        secondaryColors = ["#93E0D8", "#69A29D", "#4A7D78"];
        grayColors = ["#2D2D30", "#1F1F23"];
        titleColors = [
            "#F0F0F0",
            "rgba(0, 0, 0, 0.80)",
            "rgba(0, 0, 0, 0.90)",
        ];
    }

    const paletteColor: PaletteThemeProps = {
        primary: {
            light: primaryColors[0],
            main: primaryColors[1],
            dark: primaryColors[2],
            contrastText,
        },
        secondary: {
            light: secondaryColors[0],
            main: secondaryColors[0],
            dark: secondaryColors[0],
            contrastText,
        },
        title: {
            main: titleColors[0],
            contrastText,
        },
        lightGray: {
            light: grayColors[1],
            main: grayColors[0],
            contrastText,
        },
    };

    // Step 1️⃣ — create base theme so we can access breakpoints
    const baseTheme = createTheme({
        palette: {
            mode: mode as PaletteMode,
            common: {
                black: "#000",
                white: "#fff",
            },
            ...paletteColor,
            background: {
                default: mode === ThemeMode.DARK ? "#11011E" : "#fff",
                paper:
                    mode === ThemeMode.DARK
                        ? "rgba(41, 1, 57, 0.81)"
                        : "#fff",
            },
            text: {
                primary: titleColors[0],
                secondary:
                    mode === ThemeMode.DARK ? grayColors[0] : grayColors[1],
            },
        },
        typography: {
            fontFamily: "Inter, sans-serif",
        },
        breakpoints: {
            values: {
                xs: 0,
                sm: 768,
                md: 1024,
                lg: 1266,
                xl: 1440
            }
        },
    });

    // Step 2️⃣ — extend with component overrides using baseTheme.breakpoints
    return createTheme(baseTheme, {
        components: {
            MuiPaper: {
                styleOverrides: {
                    root: {
                        ...(mode === ThemeMode.DARK && {
                            backdropFilter: "blur(10px)",
                            WebkitBackdropFilter: "blur(10px)",
                        }),
                    },
                },
            },
            MuiInputLabel: {
                styleOverrides: {
                    root: {
                        color: titleColors[0],
                        fontSize: "12px",
                        fontWeight: 400,
                        lineHeight: "normal",
                        display: "block",
                        marginBottom: "4px",
                    },
                },
            },
            MuiOutlinedInput: {
                styleOverrides: {
                    root: {
                        width: "100%",
                        borderRadius: "27px",
                        background: "rgba(118, 107, 120, 0.55)",
                        border: "0.576px solid rgba(255, 255, 255, 0.04)",
                        color: "#fff",
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "rgba(255,255,255,0.2)",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#B801C0",
                        },
                    },
                    input: {
                        padding: "12px 16px",
                        "&::placeholder": {
                            color: "rgba(255, 255, 255, 0.2)",
                            fontWeight: 300,
                            fontSize: "12px",
                        },
                    },
                },
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        borderRadius: "27px",
                        padding: "12px 24px",
                        textAlign: "center",
                        textTransform: "capitalize",
                        width: "100%",
                        position: "relative",
                        overflow: "hidden",
                        transition: "all 0.3s ease-in-out",
                        "&:disabled": {
                            opacity: 0.5,
                            cursor: "not-allowed",
                        },
                        // ✨ Shine effect (pseudo-element)
                        "&::before": {
                            content: '""',
                            position: "absolute",
                            top: 0,
                            left: "-120%",
                            width: "60%",
                            height: "100%",
                            background: "rgba(255, 255, 255, 0.4)",
                            transform: "skew(45deg)",
                            transition: "left 0.75s ease-in-out",
                            zIndex: 1,
                        },
                        "&:hover::before": {
                            left: "155%",
                        },
                        [baseTheme.breakpoints.down("md")]: {
                            padding: "8px 16px",
                        },
                    },
                },
                variants: [
                    {
                        props: { variant: "contained", color: "primary" },
                        style: {
                            background: primaryGradColors[0],
                            color: "#fff",
                            // "&:hover": {
                            //     opacity: 0.9,
                            // },
                        },
                    },
                    {
                        props: { variant: "contained", color: "secondary" },
                        style: {
                            background: secondaryGradColors[0],
                            color: "#fff",
                            // "&:hover": {
                            //     opacity: 0.9,
                            // },
                        },
                    },
                ],
            },

            MuiList: {
                styleOverrides: { root: { padding: 0 } },
            },
            MuiListItem: {
                styleOverrides: { root: { display: "block", padding: 0 } },
            },
            MuiListItemButton: {
                styleOverrides: {
                    root: {
                        padding: "12px 12px 12px 16px",
                        transition: "justify-content 0.2s ease",
                        "&.collapsed": { justifyContent: "center" },
                        "&.expanded": { justifyContent: "flex-start" },
                        "&.active": {
                            backgroundColor: "#FEEFFF",
                            color: primaryColors[1],
                            "& .MuiListItemIcon-root": {
                                color: primaryColors[1],
                            },
                        },
                    },
                },
            },
            MuiListItemIcon: {
                styleOverrides: {
                    root: {
                        minWidth: 0,
                        justifyContent: "center",
                        transition: "margin 0.2s ease",
                        "&.collapsed": { marginRight: "auto" },
                        "&.expanded": { marginRight: "12px" },
                    },
                },
            },
            MuiListItemText: {
                styleOverrides: {
                    root: {
                        transition: "opacity 0.2s ease",
                        "&.collapsed": { opacity: 0 },
                        "&.expanded": { opacity: 1 },
                    },
                    // primary: {
                    //     whiteSpace: 'normal',
                    //     wordBreak: 'break-word',
                    // },
                    // secondary: {
                    //     whiteSpace: 'normal',
                    //     wordBreak: 'break-word',
                    // },
                },
            },

        },
    });
}
