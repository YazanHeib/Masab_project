import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const payeeAPI = createApi({
    reducerPath: "payeeAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Payee"],
    endpoints: (builder) => ({
        getPayees: builder.query({
            query: () => "/payees",
            providesTags: ["Payee"],
        }),
        getPayeeById: builder.query({
            query: (id) => `/payees/getOne/${id}`,
            providesTags: (result, error, id) => [{ type: "Payee", id }],
        }),
        createPayee: builder.mutation({
            query: (body) => ({
                url: "/payees/create",
                method: "POST",
                body,
            }),
            invalidatesTags: ["Payee"],
        }),
        updatePayee: builder.mutation({
            query: ({ id, ...body }) => ({
                url: `/payees/update/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Payee", id }],
        }),
        deletePayee: builder.mutation({
            query: (id) => ({
                url: `/payees/delete/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Payee"],
        }),
    }),
});

export const {
    useGetPayeesQuery,
    useGetPayeeByIdQuery,
    useCreatePayeeMutation,
    useUpdatePayeeMutation,
    useDeletePayeeMutation,
} = payeeAPI;
