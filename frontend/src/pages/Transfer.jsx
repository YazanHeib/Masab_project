import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateTransactionMutation } from "../redux/api/transferAPI";
import { Notif } from "../components/Notif";
import { useNavigate } from "react-router-dom";
import { useGetCustomersQuery } from "../redux/api/customerAPI";
import { useGetPayeesQuery } from "../redux/api/payeeAPI";

const Transfer = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState('');
    const [style, setStyle] = useState('');
    const [selectedType, setSelectedType] = useState('customer'); // Default: Customer

    const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm();
    const [createTransaction, { isLoading, isSuccess, isError, error }] = useCreateTransactionMutation();

    // Fetch customers and payees for selection
    const { data: customers } = useGetCustomersQuery();
    const { data: payees } = useGetPayeesQuery();

    const onSubmit = async (data) => {
        await createTransaction({
            category: data.category,
            payeeId: selectedType === "payee" ? data.selectedId : null,
            customerId: selectedType === "customer" ? data.selectedId : null,
            amount: Number(data.amount),
            description: data.description
        });
    };

    useEffect(() => {
        if (isSuccess) {
            setMessage('✅ Transfer completed successfully!');
            setStyle('primary');
            setTimeout(() => navigate('/transactions'), 1500);
        }
        if (isError) {
            const errorMsg = error?.data?.message || 'Something went wrong!';
            setMessage(errorMsg);
            setStyle('danger');
        }
    }, [isSuccess, isError, error, navigate]);

    const nextStep = async () => {
        const valid = await trigger();
        if (valid) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    return (
        <section id="main-content">
            <form id="transfer-form" onSubmit={handleSubmit(onSubmit)}>
                <h1>💸 Fund Transfer</h1>
                <p className="form-subtitle">
                    Complete the transfer in three easy steps. Choose recipient, enter amount, and confirm.
                </p>
                <Notif message={message} style={style} />

                {/* Wizard Stepper */}
                <div className="wizard-steps">
                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                        <span>1</span>
                        <p>Select Recipient</p>
                    </div>
                    <div className={`line ${step > 1 ? 'active' : ''}`}></div>
                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                        <span>2</span>
                        <p>Enter Amount</p>
                    </div>
                    <div className={`line ${step > 2 ? 'active' : ''}`}></div>
                    <div className={`step ${step === 3 ? 'active' : ''}`}>
                        <span>3</span>
                        <p>Confirm</p>
                    </div>
                </div>

                {/* Step 1 */}
                {step === 1 && (
                    <div className="form-step">
                        <h2>Step 1: Select Recipient</h2>
                        <p className="step-desc">Choose whether to pay a Customer or a Payee, then select from the list.</p>

                        {/* Toggle for Customer / Payee */}
                        <div className="toggle-selection">
                            <div
                                className={`toggle-option ${selectedType === "customer" ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedType("customer");
                                    setValue("selectedId", "");
                                }}
                            >
                                <i className="bx bx-user-pin"></i>
                                <span>Customer</span>
                            </div>
                            <div
                                className={`toggle-option ${selectedType === "payee" ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedType("payee");
                                    setValue("selectedId", "");
                                }}
                            >
                                <i className="bx bx-transfer"></i>
                                <span>Payee</span>
                            </div>
                        </div>


                        {/* Dropdown for selection */}
                        {selectedType === "customer" && (
                            <>
                                <label>Select Customer</label>
                                <select {...register("selectedId", { required: "Please select a customer" })}>
                                    <option value="">-- Select Customer --</option>
                                    {customers?.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.firstName} {c.lastName} ({c.email})
                                        </option>
                                    ))}
                                </select>
                                {errors.selectedId && <p className="error">{errors.selectedId.message}</p>}
                            </>
                        )}

                        {selectedType === "payee" && (
                            <>
                                <label>Select Payee</label>
                                <select {...register("selectedId", { required: "Please select a payee" })}>
                                    <option value="">-- Select Payee --</option>
                                    {payees?.map((p) => (
                                        <option key={p._id} value={p._id}>
                                            {p.firstName} {p.lastName} ({p.type})
                                        </option>
                                    ))}
                                </select>
                                {errors.selectedId && <p className="error">{errors.selectedId.message}</p>}
                            </>
                        )}

                        {/* Category */}
                        <label>Category</label>
                        <select {...register("category", { required: "Category is required" })}>
                            <option value="">-- Select Category --</option>
                            <option value="SALARY">Salary</option>
                            <option value="SUPPLIER">Supplier</option>
                            <option value="PENSION">Pension</option>
                            <option value="CHARGE">Charge</option>
                        </select>
                        {errors.category && <p className="error">{errors.category.message}</p>}

                        <div className="actions">
                            <button type="button" className="btn" onClick={nextStep}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <div className="form-step">
                        <h2>Step 2: Enter Amount & Description</h2>
                        <label>Amount</label>
                        <input
                            type="number"
                            {...register("amount", { required: "Amount is required", min: { value: 1, message: "Must be greater than 0" } })}
                        />
                        {errors.amount && <p className="error">{errors.amount.message}</p>}

                        <label>Description</label>
                        <textarea {...register("description")} />

                        <div className="actions">
                            <button type="button" className="btn back mx-1" onClick={prevStep}>← Back</button>
                            <button type="button" className="btn mx-1" onClick={nextStep}>Next →</button>
                        </div>
                    </div>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <div className="form-step">
                        <h2>Step 3: Review & Confirm</h2>
                        <div className="review-box">
                            <p><strong>Type:</strong> {selectedType}</p>
                            <p><strong>Recipient ID:</strong> {watch("selectedId")}</p>
                            <p><strong>Amount:</strong> ${watch("amount")}</p>
                            <p><strong>Category:</strong> {watch("category")}</p>
                            <p><strong>Description:</strong> {watch("description")}</p>
                        </div>

                        <div className="actions">
                            <button type="button" className="btn mx-1" onClick={prevStep}>← Back</button>
                            <input
                                type="submit"
                                value={isLoading ? "Processing..." : "Confirm Transfer"}
                                className="btn primary mx-1"
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                )}
            </form>
        </section>
    );
};

export default Transfer;
