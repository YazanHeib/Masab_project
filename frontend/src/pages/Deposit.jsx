import { useForm } from "react-hook-form";
import { Notif } from "../components/Notif";
import { useState } from "react";
import { formatNumber } from "../utils/Utils";
import { useGetOrgAccountQuery, useDepositMutation } from "../redux/api/orgAccountAPI";

const Deposit = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const { data: orgData, isLoading: loadingOrg, isError: errorOrg } = useGetOrgAccountQuery();
    const [deposit, { isLoading: depositLoading }] = useDepositMutation();

    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');

    const orgAccount = orgData || { balance: 0 };

    const onSubmit = async (data) => {
        try {
            const amount = parseFloat(data.balance);
            if (isNaN(amount) || amount <= 0) {
                setMessage("Please enter a valid deposit amount.");
                setStyle("error");
                return;
            }

            const response = await deposit({ amount }).unwrap();

            setMessage("✅ Deposit successful!");
            setStyle("success");
            reset();
        } catch (error) {
            console.error(error);
            setMessage("❌ Deposit failed. Please try again.");
            setStyle("error");
        }
    };

    if (loadingOrg) return <p>Loading account details...</p>;
    if (errorOrg) return <p>Failed to load organization account data.</p>;

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Deposit</h1>
                <Notif message={message} style={style} />

                {/* Current Balance */}
                <label htmlFor="balance">Current Balance</label>
                <input
                    id="balance"
                    type="text"
                    className="right big-input"
                    value={formatNumber(orgAccount.balance)}
                    disabled
                />

                <div className="transfer-icon"><i className='bx bx-up-arrow-alt'></i></div>

                {/* Deposit Amount */}
                <label htmlFor="depositAmount">Amount to Deposit</label>
                <input
                    id="depositAmount"
                    type="text"
                    autoComplete="off"
                    className={`right big-input ${errors.balance ? 'input-error' : ''}`}
                    {...register('balance', { 
                        required: 'Deposit amount is required', 
                        pattern: { value: /^[0-9]+(\.[0-9]{1,2})?$/, message: 'Enter a valid number' } 
                    })}
                />
                {errors.balance && <p className="error-text">{errors.balance.message}</p>}

                <input 
                    value={depositLoading ? "Processing..." : "Deposit"} 
                    className="btn" 
                    type="submit" 
                    disabled={depositLoading}
                />
            </form>
        </section>
    );
};

export default Deposit;
