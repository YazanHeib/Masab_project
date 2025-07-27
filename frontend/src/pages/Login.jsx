import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Logo } from "../components/Logo";
import { Notif } from "../components/Notif";
import clsx from "clsx";
import { useNavigate } from 'react-router-dom';
import { useLoginUserMutation } from "../redux/api/authAPI";

const Login = () => {
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();
    const onSubmitHandler = (data) => {
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage('You successfully logged in');
            setStyle('primary')
            navigate('/home');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            setMessage(errorMsg);
            setStyle('danger')
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    return (
        <div id="login-page">
            <div id="login">
                <Logo />
                <Notif message={message} style={style} />
                <form onSubmit={handleSubmit(onSubmitHandler)}>
                    <div className="my-3">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="off"
                            className={clsx({ 'is-invalid': errors.email })}
                            {...register('email', { required: 'Email is required' })}
                        />
                        {errors.email && (
                            <small className="error">{errors.email.message}</small>
                        )}
                    </div>

                    <div className="my-3">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="off"
                            className={clsx({ 'is-invalid': errors.password })}
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && (
                            <small className="error">{errors.password.message}</small>
                        )}
                    </div>

                    <button type="submit" className="btn">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
