import { setBalance, updateBalancePerProvider } from "@/slice/userBalanceSlice";
import { GlobalResponse } from "@/types/config";
import { CredentialsResponseProps } from "@/types/game";
import { SinlgePlayerResponseProps, WalletProps } from "@/types/player";
import { UserBalanceResponse } from "@/types/user";
import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";

export const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: baseQuery,
    tagTypes: ['user', 'wallet'],
    endpoints: (builder) => ({
        addUserWallet: builder.mutation<SinlgePlayerResponseProps, WalletProps>({
            query: (body) => ({
                url: "/api/connect-wallet",
                method: "POST",
                body: body
            }),
            invalidatesTags: ['wallet']
        }),
        updateUserProfile: builder.mutation<SinlgePlayerResponseProps, { id: string, body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/update/user-information/${id}`,
                method: "POST",
                body: body
            }),
            invalidatesTags: ['user', "wallet"]
        }),
        getUserBalance: builder.query<UserBalanceResponse, void>({
            query: () => ({
                url: "/api/get-balance",
                method: "GET",
            }),

            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(setBalance(data?.data));
                } catch { }
            },

            providesTags: ['user']
        }),

        getUserBalanceBySlug: builder.query<{ data: { provider: string; balance: number, flag: string, has_changed_password: boolean } }, { slug: string }>({
            query: ({ slug }) => ({
                url: `/api/balance/${slug}`,
                method: "GET"
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    dispatch(updateBalancePerProvider({ balance: data?.data.balance, provider: arg.slug }));
                } catch { }
            },
            providesTags: ['user']
        }),

        getUserGameBalance: builder.query<SinlgePlayerResponseProps, void>({
            query: () => ({
                url: "/api/detail/get-balance",
                method: "GET"
            }),
            providesTags: ['user']
        }),

        getUserGameCredentials: builder.query<CredentialsResponseProps, void>({
            query: () => ({
                url: `/api/credentials`,
                method: "GET"
            }),
            providesTags: ['user']
        }),

        changeUserGamePassword: builder.mutation<GlobalResponse, { password: string; confirm_password: string, name: string }>({
            query: ({ password, confirm_password, name }) => ({
                url: `/api/change-password?for=${name}`,
                method: "POST",
                body: {
                    password,
                    password_confirmation: confirm_password
                }
            }),
            invalidatesTags: ['user', "wallet"],
        }),

        updateUserGamePassword: builder.mutation<GlobalResponse, { password: string; provider: string }>({
            query: ({ password, provider }) => ({
                url: `/api/game/change-password`,
                method: "POST",
                body: {
                    password,
                    provider
                }
            }),
            invalidatesTags: ['user', "wallet"],
        }),

        getGamesPasswordStatus: builder.query<{ data: { has_changed_password: boolean } }, { provider: string }>({
            query: ({ provider }) => ({
                url: `/api/game/${provider}/has-changed-password`,
                method: "GET",
            }),
            providesTags: ['user', "wallet"],
        }),

        verifyUserForWithdrawl: builder.mutation<GlobalResponse & {
            data: {
                redirect_url: string;
            }
        }, { token?: string }>({
            query: ({ token }) => ({
                url: `/api/payment/verify-user${token ? `?token=${token}` : ""}`,
                method: "POST"
            }),
            invalidatesTags: ["user"]
        }),
        getVerificationLink: builder.mutation<GlobalResponse & {
            data: {
                data: string;
            }
        }, void>({
            query: () => ({
                url: `/api/payment/verify-user`,
                method: "GET"
            }),
            invalidatesTags: ["user"]
        })
    })

})

export const { useAddUserWalletMutation, useUpdateUserProfileMutation, useGetUserBalanceQuery, useGetUserBalanceBySlugQuery, useGetUserGameBalanceQuery, useGetUserGameCredentialsQuery, useChangeUserGamePasswordMutation, useUpdateUserGamePasswordMutation, useGetGamesPasswordStatusQuery, useVerifyUserForWithdrawlMutation, useGetVerificationLinkMutation } = userApi;