import { Pagination } from "./game";

type TransactionStatus = "SUCCESS" | "UNSUCCESSFUL" | "PENDING";

export interface DepositProps {
    id: string;
    amount: number;
    type?: "crypto" | "finix"
}

export interface DepositUrlProps {
    payment_id: string;
    status: string;
    amount: number;
    currency: string;
    payment_url: string;
    merchant_id: string;

}


export interface DepositResponseProps {
    message: string;
    success: true;
    data: DepositUrlProps;
}
export interface SingleDepositProps {
    id: number;
    transaction_id: string;
    username: string;
    first_name: string;
    last_name: string;
    method: string;
    game_name: string;
    type: string;
    amount: number;
    sweepcoins: number;
    transaction_date: string;
    available_balance?: string;
    status: TransactionStatus;
}

export interface DepositListProps {
    data: {
        data: SingleDepositProps[];
        pagination: Pagination;
    }
    success: boolean;
    message: string;
}