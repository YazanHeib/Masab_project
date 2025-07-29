import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Notif } from "../components/Notif";
import { useCreatePayeeMutation } from "../redux/api/payeeAPI";
import { useNavigate } from "react-router-dom";

const CreatePayee = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");
    const [createPayee, { isLoading, isError, error, isSuccess }] = useCreatePayeeMutation();

    const createRandomAccount = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000);
    };

    const onSubmit = async (data) => {
        await createPayee(data);
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage("Payee created successfully!");
            setStyle("primary");
            navigate("/payees");
        }
        if (isError) {
            const errorMsg = error?.data?.message || "Failed to create payee";
            setMessage(errorMsg);
            setStyle("danger");
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Create Payee</h1>
                <Notif message={message} style={style} />

                {/* Type */}
                <label htmlFor="type">Type</label>
                <select id="type" {...register("type", { required: "Type is required" })}>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="SUPPLIER">Supplier</option>
                    <option value="PENSION">Pension</option>
                </select>
                {errors.type && <p className="error">{errors.type.message}</p>}

                {/* First Name */}
                <label htmlFor="firstName">First Name</label>
                <input id="firstName" type="text" {...register("firstName", { required: "First name is required" })} />
                {errors.firstName && <p className="error">{errors.firstName.message}</p>}

                {/* Last Name */}
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" {...register("lastName", { required: "Last name is required" })} />
                {errors.lastName && <p className="error">{errors.lastName.message}</p>}

                {/* Bank */}
                <label htmlFor="bank">Bank</label>
                <input id="bank" type="text" {...register("bank", { required: "Bank is required" })} />
                {errors.bank && <p className="error">{errors.bank.message}</p>}

                {/* Branch */}
                <label htmlFor="branch">Branch</label>
                <input id="branch" type="text" {...register("branch", { required: "Branch is required" })} />
                {errors.branch && <p className="error">{errors.branch.message}</p>}

                {/* Account */}
                <label htmlFor="account">Account # (Randomly Generated)</label>
                <input id="account" type="text" {...register("account")} value={createRandomAccount()} readOnly />
                
                {/* Email */}
                <label htmlFor="email">Email</label>
                <input
                    id="email"
                    type="email"
                    {...register("email", {
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                    })}
                />
                {errors.email && <p className="error">{errors.email.message}</p>}

                {/* Submit */}
                <input type="submit" value="Create Payee" className="btn" />
            </form>
        </section>
    );
};

export default CreatePayee;
