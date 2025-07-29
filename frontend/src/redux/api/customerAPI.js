import { createApi } from "@reduxjs/toolkit/query/react";
import defaultFetchBase from "./defaultFetchBase";

export const customerAPI = createApi({
    reducerPath: "customerAPI",
    baseQuery: defaultFetchBase,
    tagTypes: ["Customer"],
    endpoints: (builder) => ({
        getCustomers: builder.query({
            query: () => ({
                url: "/customers",
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Customer"],
        }),

        getCustomer: builder.query({
            query: (id) => ({
                url: `/customers/getOne/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: (result, error, id) => [{ type: "Customer", id }],
        }),

        createCustomer: builder.mutation({
            query: (customerData) => ({
                url: "/customers/create",
                method: "POST",
                body: customerData,
                credentials: "include",
            }),
            invalidatesTags: ["Customer"],
        }),

        updateCustomer: builder.mutation({
            query: ({ id, ...customerData }) => ({
                url: `/customers/update/${id}`,
                method: "PUT",
                body: customerData,
                credentials: "include",
            }),
            invalidatesTags: (result, error, { id }) => [{ type: "Customer", id }],
        }),

        deleteCustomer: builder.mutation({
            query: (id) => ({
                url: `/customers/delete/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Customer"],
        }),
    }),
});

export const {
    useGetCustomersQuery,
    useGetCustomerQuery,
    useCreateCustomerMutation,
    useUpdateCustomerMutation,
    useDeleteCustomerMutation,
} = customerAPI;
