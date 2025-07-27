import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setToken, setUserData } from '../../utils/Utils';
import { getMeAPI } from './getMeAPI';

const baseUrl = `${import.meta.env.VITE_SERVER_ENDPOINT}/api`;

export const authAPI = createApi({
    reducerPath: 'authAPI',
    baseQuery: fetchBaseQuery({
        baseUrl,
    }),
    endpoints: (builder) => ({
        loginUser: builder.mutation({
            query: (data) => ({
                url: '/auth/login',
                method: 'POST',
                body: data,
                credentials: 'include',
            }),
            async onQueryStarted(_args, { dispatch, queryFulfilled }) {
                try {
                    const { data } = await queryFulfilled;
                    setToken(data.accessToken);
                    setUserData(JSON.stringify(data.userData));
                    // Optionally trigger getMe
                    dispatch(getMeAPI.endpoints.getMe.initiate(null));
                } catch (error) {
                    console.error('Login failed:', error);
                }
            },
        }),
    }),
});

export const { useLoginUserMutation } = authAPI;
