import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    useGetTransactionQuery,
    useUpdateTransactionStatusMutation,
} from "../redux/api/transferAPI";
import { Notif } from "../components/Notif";
import axios from "axios";

const ViewTransaction = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: transaction, isLoading, isError, refetch } = useGetTransactionQuery(id);
    const [updateStatus, { isLoading: updating }] = useUpdateTransactionStatusMutation();

    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");

    const handleMarkDone = async () => {
        try {
            await updateStatus({ id, status: "DONE" }).unwrap();
            setMessage("✅ Transaction marked as DONE successfully!");
            setStyle("primary");
            refetch();
        } catch (err) {
            setMessage("❌ Failed to update status.");
            setStyle("danger");
        }
    };

    const handleDownloadReceipt = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_SERVER_ENDPOINT}/api/transactions/${id}/receipt`,
                { responseType: "blob" } // Important for file download
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `receipt-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setMessage("❌ Failed to download receipt.");
            setStyle("danger");
        }
    };

    useEffect(() => {
        if (isError) {
            setMessage("Failed to load transaction details.");
            setStyle("danger");
        }
    }, [isError]);

    if (isLoading) return <section id="main-content"><p>Loading transaction details...</p></section>;
    if (!transaction) return <section id="main-content"><p>No transaction found.</p></section>;

    return (
        <section id="main-content">
            <Notif message={message} style={style} />
            <div className="invoice-wrapper">
                <div className="invoice-box">
                    {/* Invoice Header */}
                    <header className="invoice-header">
                        <div className="logo-section">
                            <i className="bx bx-receipt logo-icon"></i>
                            <h1>Transaction Invoice</h1>
                            <p className="invoice-id">Invoice #{transaction._id}</p>
                        </div>
                        <div className="invoice-status">
                            <span className={`badge ${transaction.status === "DONE" ? "badge-success" : "badge-warning"}`}>
                                {transaction.status}
                            </span>
                        </div>
                    </header>

                    {/* Company & Customer Info */}
                    <div className="invoice-details">
                        <div>
                            <h3>From:</h3>
                            <p><strong>Masab Organization</strong></p>
                            <p>Banking System</p>
                            <p>Email: support@masab.com</p>
                        </div>
                        <div>
                            <h3>To:</h3>
                            <p>
                                {transaction.payeeId
                                    ? `${transaction.payeeId.firstName} ${transaction.payeeId.lastName}`
                                    : transaction.customerId
                                        ? `${transaction.customerId.firstName} ${transaction.customerId.lastName}`
                                        : "N/A"}
                            </p>
                            <p>{transaction.category}</p>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <table className="invoice-table">
                        <thead>
                            <tr>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>{transaction.description || "N/A"}</td>
                                <td>{transaction.category}</td>
                                <td>${transaction.amount.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Footer */}
                    <div className="invoice-footer">
                        <p><strong>Date:</strong> {new Date(transaction.createdAt).toLocaleString()}</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="invoice-actions">
                        <button className="btn" onClick={() => navigate("/transactions")}>← Back</button>
                        {transaction.status === "PENDING" && (
                            <button className="btn primary" onClick={handleMarkDone} disabled={updating}>
                                {updating ? "Updating..." : "Mark as Done"}
                            </button>
                        )}
                        {transaction.status === "DONE" && (
                            <button className="btn success" onClick={handleDownloadReceipt}>
                                ⬇ Download Receipt
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ViewTransaction;
