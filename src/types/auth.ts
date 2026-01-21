export type RoleProps = "SUPER_ADMIN" | "ADMIN" | "USER"

export type LoginProps = {
    email: string;
    password: string;
    device_id?: string;
}

export interface User {
    id: string;
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    profile_image: string;
    wallet_address: string;
    address: string;
    city: string;
    street: string;
    zip_code: string;
    role: RoleProps;
    pob?: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        access_token: string,
        // expires_in: 3600,
        user: User,
        redirect_url: string;
    }
    message: string
}
export interface RegisterProps extends LoginProps {
    username: string;
    password_confirmation: string;
    first_name: string;
    middle_name: string;
    last_name: string;
    phone: string;
    photoid_number: string;
    dob: string;
    city: string;
    pob: string;
    street: string;
    zip_code: string;
    agree: boolean;
}