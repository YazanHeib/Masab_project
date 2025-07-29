import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Notif } from "../components/Notif";
import { useGetCustomerQuery, useUpdateCustomerMutation } from "../redux/api/customerAPI";
import { useNavigate, useParams } from "react-router-dom";

const UpdateCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Fetch existing customer data
    const { data: customer, isLoading: isFetching, isError: fetchError } = useGetCustomerQuery(id);

    // Form
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');

    // Mutation
    const [updateCustomer, { isLoading, isError, error, isSuccess }] = useUpdateCustomerMutation();

    useEffect(() => {
        if (customer) {
            reset(customer); // Prefill form with existing customer data
        }
    }, [customer, reset]);

    const onSubmit = async (data) => {
        await updateCustomer({ id, ...data });
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage('Customer updated successfully!');
            setStyle('primary');
            navigate('/customers');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data || 'Update failed';
            setMessage(errorMsg);
            setStyle('danger');
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    if (isFetching) return <p>Loading customer data...</p>;
    if (fetchError) return <p>Error loading customer data.</p>;

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Update Customer</h1>
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

                {/* Account */}
                <label htmlFor="account">Account #</label>
                <input
                    id="account"
                    type="text"
                    {...register('account')}
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
                <input value="Update Customer" className="btn" type="submit" />
            </form>
        </section>
    );
};

export default UpdateCustomer;
