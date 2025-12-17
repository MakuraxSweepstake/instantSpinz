import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import { DepositListProps, DepositProps, DepositResponseProps, DepositUrlProps } from "@/types/transaction";
import { QueryParams } from "@/types/config";
import { TransactionStatusProps } from "@/components/pages/dashboard/adminDashboard/transaction/TransactionTable";

export const transactionApi = createApi({
    reducerPath: "transactionApi",
    baseQuery: baseQuery,
    tagTypes: ["Deposit", "Withdrawl"],
    endpoints: (builder) => ({
        deposit: builder.mutation<DepositResponseProps, DepositProps>({
            query: ({ id, amount, type }) => ({
                url: `/api/payment/${id}`,
                method: "POST",
                body: { amount: amount, type: type }
            }),
            invalidatesTags: ["Deposit"]
        }),
        getAllDeposit: builder.query<DepositListProps, QueryParams & { days: number | null; customRange: { startDate: string | null; endDate: string | null } }>({
            query: ({ search, pageIndex, pageSize, days, customRange }) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (pageIndex) params.append('page', pageIndex.toString());
                if (pageSize) params.append('page_size', pageSize.toString());
                if (days) params.append('days', days.toString());
                if (customRange.startDate) params.append('start_date', customRange.startDate.toString());
                if (customRange.endDate) params.append('end_date', customRange.endDate.toString());
                const queryString = params.toString();
                return {
                    url: `/api/deposits${queryString ? `?${queryString}` : ''}`,
                    method: "GET"
                }
            },
            providesTags: ['Deposit']
        }),
        withdrawl: builder.mutation<DepositResponseProps, any>({
            query: (body) => ({
                url: `/api/user/withdrawl`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ["Withdrawl"]
        }),
        getAllWithdrawl: builder.query<DepositListProps, QueryParams & { days: number | null; customRange: { startDate: string | null; endDate: string | null } }>({
            query: ({ search, pageIndex, pageSize, days, customRange }) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (pageIndex) params.append('page', pageIndex.toString());
                if (pageSize) params.append('page_size', pageSize.toString());
                if (days) params.append('days', days.toString());
                if (customRange.startDate) params.append('start_date', customRange.startDate.toString());
                if (customRange.endDate) params.append('end_date', customRange.endDate.toString());

                const queryString = params.toString();
                return {
                    url: `/api/user/withdrawl${queryString ? `?${queryString}` : ''}`,
                    method: "GET"
                }
            },
            providesTags: ["Withdrawl"]
        }),
        getAllTransaction: builder.query<DepositListProps, QueryParams & { status?: TransactionStatusProps; user_id?: string | number; game_id?: string | number, selectedGame?: string; selectedTransactionType?: string, start_date?: string; end_date?: string; }>({
            query: ({ search, pageIndex, pageSize, user_id, game_id, status, selectedGame, selectedTransactionType, start_date, end_date }) => {
                const params = new URLSearchParams();
                if (search) params.append('search', search);
                if (pageIndex) params.append('page', pageIndex.toString());
                if (pageSize) params.append('page_size', pageSize.toString());
                if (user_id) params.append('user', user_id.toString());
                if (game_id) params.append('game', game_id.toString());
                if (status) params.append('status', status.toString());
                if (selectedGame) params.append('game', selectedGame.toString());
                if (selectedTransactionType) params.append('type', selectedTransactionType.toString());
                if (start_date) params.append('start_date', start_date.toString());
                if (end_date) params.append('end_date', end_date.toString());
                const queryString = params.toString();
                return {
                    url: `/api/admin/transactions${queryString ? `?${queryString}` : ''}`,
                    method: "GET"
                }
            },
            providesTags: ["Withdrawl", "Deposit"]
        }),
    })
})

export const { useDepositMutation, useGetAllDepositQuery, useWithdrawlMutation, useGetAllWithdrawlQuery, useGetAllTransactionQuery } = transactionApi;