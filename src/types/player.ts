import { Pagination } from "./game";


export interface CommonPlayerProps {
    name: string;
    email: string;
    first_name: string;
    last_name: string;
    wallet_address?: string;
    address?: string;
    city?: string;
    phone?: string;
    password: string;
    password_confirmation: string;
    role?: string;
    pob?: string;
}
export interface PlayerProps extends CommonPlayerProps {
    id?: string;
    profile_image: File | null;
    profile_image_file?: string;
    registered_date?: string | Date;
    current_credit?: string,
    total_withdrawl?: string,
    total_deposited?: string
}

export const initialPlayerValues: PlayerProps = {
    name: "",
    email: "",
    first_name: "",
    last_name: "",
    wallet_address: "",
    address: "",
    city: "",
    phone: "",
    password: "",
    password_confirmation: "",
    profile_image: null,
};

type GameInformation = {
    balance: number,
    game_logo: string,
    game_name: string,
    percentage: number,
    type: string
}
export interface PlayerItem extends CommonPlayerProps {
    id: string;
    registered_date: string | Date;
    current_credit?: string,
    current_balance?: string,
    total_withdrawn?: string,
    total_deposited?: string
    profile_image_file?: string;
    is_suspended?: boolean;
    game_information?: {
        [key: string]: GameInformation | undefined;
    }
}

export interface PlayerListResponse {
    data: {
        data: PlayerItem[];
        pagination: Pagination;
    }
    message: string;
    status: string;
}
export interface SinlgePlayerResponseProps {
    data: PlayerItem;
    message?: string;
    status?: string;
}

export interface WalletProps {
    wallet_address: string;
}