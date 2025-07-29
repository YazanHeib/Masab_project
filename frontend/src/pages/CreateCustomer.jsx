import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Notif } from "../components/Notif";
import { useCreateCustomerMutation } from "../redux/api/customerAPI";
import { useNavigate } from "react-router-dom";

const CreateCustomer = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const [createCustomer, { isLoading, isError, error, isSuccess }] = useCreateCustomerMutation();
    // Random Account Number Generator
    const createRandomAccount = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    };

    const onSubmit = async (data) => {
        await createCustomer(data);
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage('Customer created successfully!');
            setStyle('primary')
            navigate('/customers');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            setMessage(errorMsg);
            setStyle('danger')
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Create Customer</h1>
                <Notif message={message} style={style} />

                {/* First Name */}
                <label htmlFor="firstName">First Name</label>
                <input
                    id="firstName"
                    type="text"
                    {...register('firstName', { required: 'First name is required' })}
                />
                {errors.firstName && <p className="error">{errors.firstName.message}</p>}

                {/* Last Name */}
                <label htmlFor="lastName">Last Name</label>
                <input
                    id="lastName"
                    type="text"
                    {...register('lastName', { required: 'Last name is required' })}
                />
                {errors.lastName && <p className="error">{errors.lastName.message}</p>}

                {/* Bank */}
                <label htmlFor="bank">Bank Name</label>
                <input
                    id="bank"
                    type="text"
                    {...register('bank', { required: 'Bank name is required' })}
                />
                {errors.bank && <p className="error">{errors.bank.message}</p>}

                {/* Branch */}
                <label htmlFor="branch">Branch</label>
                <input
                    id="branch"
                    type="text"
                    {...register('branch', { required: 'Branch is required' })}
                />
                {errors.branch && <p className="error">{errors.branch.message}</p>}

                {/* Account (Read-Only Random Number) */}
                <label htmlFor="account">Account # (Randomly Generated)</label>
                <input
                    id="account"
                    type="text"
                    {...register('account')}
                    value={createRandomAccount()}
                    readOnly
                />

                {/* Email */}
                <label htmlFor="email">Email Address</label>
                <input
                    id="email"
                    type="email"
                    {...register('email', {
                        required: 'Email is required',
                        pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                    })}
                />
                {errors.email && <p className="error">{errors.email.message}</p>}

                {/* Submit */}
                <input value="Create Customer" className="btn" type="submit" />
            </form>
        </section>
    );
};

export default CreateCustomer;
