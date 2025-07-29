import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetTransactionQuery, useUpdateTransactionStatusMutation } from "../redux/api/transferAPI";
import { Notif } from "../components/Notif";

const ViewTransaction = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: transaction, isLoading, isError } = useGetTransactionQuery(id);
    const [updateStatus, { isLoading: updating }] = useUpdateTransactionStatusMutation();

    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");

    const handleMarkDone = async () => {
        try {
            await updateStatus({ id, status: "DONE" }).unwrap();
            setMessage("Transaction marked as DONE successfully.");
            setStyle("primary");
        } catch (err) {
            setMessage("Failed to update status.");
            setStyle("danger");
        }
    };

    useEffect(() => {
        if (isError) {
            setMessage("Failed to load transaction details.");
            setStyle("danger");
        }
    }, [isError]);

    if (isLoading) {
        return <section id="main-content"><p>Loading transaction details...</p></section>;
    }

    if (!transaction) {
        return <section id="main-content"><p>No transaction found.</p></section>;
    }

    return (
        <section id="main-content">
            <h1>Transaction Details</h1>
            <Notif message={message} style={style} />

            <div className="transaction-card">
                <p><i className="bx bx-hash"></i> <strong>ID:</strong> {transaction._id}</p>
                <p><i className="bx bx-transfer"></i> <strong>Type:</strong> {transaction.type}</p>
                <p><i className="bx bx-category"></i> <strong>Category:</strong> {transaction.category}</p>
                <p><i className="bx bx-user"></i> <strong>Payee:</strong> {transaction.payeeId ? `${transaction.payeeId.firstName} ${transaction.payeeId.lastName}` : "-"}</p>
                <p><i className="bx bx-user-circle"></i> <strong>Customer:</strong> {transaction.customerId ? `${transaction.customerId.firstName} ${transaction.customerId.lastName}` : "-"}</p>
                <p><i className="bx bx-dollar"></i> <strong>Amount:</strong> ${transaction.amount.toFixed(2)}</p>
                <p><i className="bx bx-note"></i> <strong>Description:</strong> {transaction.description || "N/A"}</p>
                <p><i className="bx bx-time"></i> <strong>Status:</strong> 
                    <span className={`status ${transaction.status === "DONE" ? "done" : "pending"}`}>
                        {transaction.status}
                    </span>
                </p>
                <p><i className="bx bx-calendar"></i> <strong>Created At:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
            </div>

            <div className="transaction-actions">
                <button className="btn" onClick={() => navigate("/transactions")}>Back</button>
                {transaction.status === "PENDING" && (
                    <button className="btn primary" onClick={handleMarkDone} disabled={updating}>
                        {updating ? "Updating..." : "Mark as Done"}
                    </button>
                )}
            </div>
        </section>
    );
};

export default ViewTransaction;
