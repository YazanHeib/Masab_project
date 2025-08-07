import { configureStore } from '@reduxjs/toolkit';
import { authAPI } from './api/authAPI';
import { getMeAPI } from './api/getMeAPI';
import { useDispatch, useSelector } from 'react-redux';
import userReducer from './api/userSlice';
import { customerAPI } from './api/customerAPI';
import { payeeAPI } from './api/payeeAPI';
import { transferAPI } from './api/transferAPI';
import { orgAccountAPI } from './api/orgAccountAPI';

export const store = configureStore({
    reducer: {
        [authAPI.reducerPath]: authAPI.reducer,
        [getMeAPI.reducerPath]: getMeAPI.reducer,
        [customerAPI.reducerPath]: customerAPI.reducer,
        [payeeAPI.reducerPath]: payeeAPI.reducer,
        [transferAPI.reducerPath]: transferAPI.reducer,
        [orgAccountAPI.reducerPath]: orgAccountAPI.reducer,
        userState: userReducer,
    },
    devTools: process.env.NODE_ENV === 'development',
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([
            authAPI.middleware,
            getMeAPI.middleware,
            customerAPI.middleware,
            payeeAPI.middleware,
            transferAPI.middleware,
            orgAccountAPI.middleware,
        ]),
});

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
