import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const transferAPI = createApi({
    reducerPath: "transferAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Transactions"],
    endpoints: (builder) => ({
        // List all transactions
        getTransactions: builder.query({
            query: () => ({
                url: "/transactions",
                method: "GET"
            }),
            providesTags: ["Transactions"]
        }),

        // Get single transaction
        getTransaction: builder.query({
            query: (id) => ({
                url: `/transactions/getOne/${id}`,
                method: "GET"
            })
        }),

        // Create transaction (transfer)
        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions/create",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Transactions"]
        }),
        updateTransactionStatus: builder.mutation({
            query: ({ id, status }) => ({
                url: `/transactions/updateStatus/${id}`,
                method: "PATCH",
                body: { status }
            }),
            invalidatesTags: (result, error, { id }) => [
                "Transactions",
                { type: "Transactions", id }
            ]
        })
    })
});

export const {
    useGetTransactionsQuery,
    useGetTransactionQuery,
    useCreateTransactionMutation,
    useUpdateTransactionStatusMutation
} = transferAPI;
