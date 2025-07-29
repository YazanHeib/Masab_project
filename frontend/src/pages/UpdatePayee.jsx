import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Notif } from "../components/Notif";
import { useUpdatePayeeMutation, useGetPayeeByIdQuery } from "../redux/api/payeeAPI";
import { useParams, useNavigate } from "react-router-dom";

const UpdatePayee = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: payee, isLoading: isFetching } = useGetPayeeByIdQuery(id);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");
    const [updatePayee, { isLoading, isError, error, isSuccess }] = useUpdatePayeeMutation();

    useEffect(() => {
        if (payee) reset(payee);
    }, [payee, reset]);

    const onSubmit = async (data) => {
        await updatePayee({ id, ...data });
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage("Payee updated successfully!");
            setStyle("primary");
            navigate("/payees");
        }
        if (isError) {
            const errorMsg = error?.data?.message || "Failed to update payee";
            setMessage(errorMsg);
            setStyle("danger");
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    if (isFetching) return <p>Loading payee...</p>;

    return (
        <section id="main-content">
            <form id="form" onSubmit={handleSubmit(onSubmit)}>
                <h1>Update Payee</h1>
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

                {/* Last Name */}
                <label htmlFor="lastName">Last Name</label>
                <input id="lastName" type="text" {...register("lastName", { required: "Last name is required" })} />

                {/* Bank */}
                <label htmlFor="bank">Bank</label>
                <input id="bank" type="text" {...register("bank", { required: "Bank is required" })} />

                {/* Branch */}
                <label htmlFor="branch">Branch</label>
                <input id="branch" type="text" {...register("branch", { required: "Branch is required" })} />

                {/* Account */}
                <label htmlFor="account">Account</label>
                <input id="account" type="text" {...register("account")} readOnly />

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

                {/* Submit */}
                <input type="submit" value="Update Payee" className="btn" />
            </form>
        </section>
    );
};

export default UpdatePayee;
