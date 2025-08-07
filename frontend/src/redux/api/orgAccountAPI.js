import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const orgAccountAPI = createApi({
    reducerPath: "orgAccountAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["OrgAccount"],
    endpoints: (builder) => ({
        getOrgAccount: builder.query({
            query: () => ({
                url: "/orgAccounts",
                method: "GET",
            }),
            providesTags: ["OrgAccount"],
        }),
    }),
});

export const { useGetOrgAccountQuery } = orgAccountAPI;
