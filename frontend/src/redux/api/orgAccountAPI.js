import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const orgAccountAPI = createApi({
    reducerPath: "orgAccountAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["OrgAccount"],
    endpoints: (builder) => ({

        /** ✅ Get Organization Account **/
        getOrgAccount: builder.query({
            query: () => ({
                url: "/orgAccounts",
                method: "GET",
            }),
            providesTags: ["OrgAccount"],
        }),

        /** ✅ Deposit Mutation **/
        deposit: builder.mutation({
            query: (body) => ({
                url: "/orgAccounts/deposit",
                method: "POST",
                body,
            }),
            invalidatesTags: ["OrgAccount"], // refresh org account data after deposit
        }),
    }),
});

export const { useGetOrgAccountQuery, useDepositMutation } = orgAccountAPI;
