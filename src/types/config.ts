import { ThemeMode } from "@/config";

export type FontFamily = string;
export type I18n = 'en' | 'ar';

export type DefaultConfigProps = {
    fontFamily: FontFamily;
    i18n: I18n;
    miniDrawer: boolean;
    mode: ThemeMode;
}

export type CustomizationProps = {
    fontFamily: FontFamily;
    i18n: I18n;
    miniDrawer: boolean;
    mode: ThemeMode;
    onChangeMode: (mode: ThemeMode) => void,
    onChangeLocalization: (lang: I18n) => void,
    onChangeMiniDrawer: (miniDrawer: boolean) => void,
}

export type ImageProps = {
    src: string;
    alt: string;
    width?: string;
    height?: string;
}

export interface GlobalResponse {
    status: string;
    message: string
}

export interface QueryParams {
    pageIndex?: number;
    pageSize?: number;
    search?: string;
    status?: string;
}

export const StatusOptions = [
    { label: "Success", value: "success" },
    { label: "Pending", value: "pending" },
    { label: "Failed", value: "failed" },
]