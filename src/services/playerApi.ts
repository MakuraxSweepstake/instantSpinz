// services/playerApi.ts

import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import {
    PlayerListResponse,
    PlayerProps,
    SinlgePlayerResponseProps,
} from "@/types/player";
import { GlobalResponse, QueryParams } from "@/types/config";

export const playerApi = createApi({
    reducerPath: "playerApi",
    baseQuery: baseQuery,
    tagTypes: ["Players"],
    endpoints: (builder) => ({
        // CREATE PLAYER
        createPlayer: builder.mutation<PlayerListResponse, FormData>({
            query: (body) => ({
                url: "/api/admin/add-user",
                method: "POST",
                body,
            }),
            invalidatesTags: [{ type: "Players", id: "LIST" }],
        }),

        // GET ALL Players
        getAllPlayer: builder.query<PlayerListResponse, QueryParams>({
            query: ({ search, pageIndex, pageSize, status }) => {
                const params = new URLSearchParams();
                if (search) params.append("search", search);
                if (pageIndex) params.append("page", pageIndex.toString());
                if (pageSize) params.append("page_size", pageSize.toString());
                if (status) params.append("status", status.toString());
                const queryString = params.toString();
                return {
                    url: `/api/admin/get-users${queryString ? `?${queryString}` : ""}`,
                    method: "GET",
                };
            },
            providesTags: (result) =>
                result?.data
                    ? [
                        ...result.data.data.map((player) => ({
                            type: "Players" as const,
                            id: player.id,
                        })),
                        { type: "Players", id: "LIST" },
                    ]
                    : [{ type: "Players", id: "LIST" }],
        }),

        // GET SINGLE PLAYER
        getPlayerById: builder.query<SinlgePlayerResponseProps, { id: number }>({
            query: ({ id }) => ({
                url: `/api/admin/get-user/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, { id }) => [{ type: "Players", id }],
        }),

        // GET PLAYER BALANCE BY ID
        getPlayerBalanceById: builder.query<SinlgePlayerResponseProps, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/get-balance/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, { id }) => [{ type: "Players", id }],
        }),

        // UPDATE PLAYER
        updatePlayerById: builder.mutation<SinlgePlayerResponseProps, { id: string; body: FormData }>({
            query: ({ id, body }) => ({
                url: `/api/admin/update-user/${id}`,
                method: "POST",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Players", id }],
        }),

        // DELETE PLAYER
        deletePlayerById: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/user/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, { id }) => [
                { type: "Players", id },
                { type: "Players", id: "LIST" },
            ],
        }),

        // SUSPEND PLAYER
        suspendPlayerById: builder.mutation<GlobalResponse, { id: string }>({
            query: ({ id }) => ({
                url: `/api/admin/user/suspend/${id}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Players", id }],
        }),
    }),
});

export const {
    useCreatePlayerMutation,
    useGetAllPlayerQuery,
    useGetPlayerByIdQuery,
    useGetPlayerBalanceByIdQuery,
    useUpdatePlayerByIdMutation,
    useDeletePlayerByIdMutation,
    useSuspendPlayerByIdMutation,
} = playerApi;
