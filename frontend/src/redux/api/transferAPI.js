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
                url: `/transactions/${id}`,
                method: "GET"
            })
        }),

        // Create transaction (transfer)
        createTransaction: builder.mutation({
            query: (data) => ({
                url: "/transactions",
                method: "POST",
                body: data
            }),
            invalidatesTags: ["Transactions"]
        })
    })
});

export const {
    useGetTransactionsQuery,
    useGetTransactionQuery,
    useCreateTransactionMutation
} = transferAPI;
