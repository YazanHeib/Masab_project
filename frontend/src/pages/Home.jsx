import { useEffect, useState } from "react";
import { useGetTransactionsQuery } from "../redux/api/transferAPI";
import { useGetOrgAccountQuery } from "../redux/api/orgAccountAPI";
import { getDateFormat } from "../utils/Utils";

const Home = () => {
    // Fetch transactions & org account from API
    const { data: transactionData, isLoading: loadingTransactions, isError: errorTransactions } =
        useGetTransactionsQuery();
    const { data: orgData, isLoading: loadingOrg, isError: errorOrg } = useGetOrgAccountQuery();

    const transactions = transactionData?.transactions || [];
    const orgAccount = orgData || null;

    // ✅ Last 5 transactions
    const lastFiveTransactions = transactions
        .slice(0, 5)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    if (loadingTransactions || loadingOrg) {
        return <p className="text-center mt-4">Loading dashboard...</p>;
    }

    if (errorTransactions || errorOrg) {
        return <p className="text-center text-danger mt-4">Failed to load dashboard data.</p>;
    }

    return (
        <section className="container mt-4">
            <h1 className="mb-4">🏠 Dashboard</h1>

            {/* ✅ Top Summary Cards */}
            <div className="row mb-4">
                {/* Balance */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-primary shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Current Balance</h5>
                            <h3>${orgAccount.balance.toFixed(2)}</h3>
                            <small>Updated in real-time</small>
                        </div>
                    </div>
                </div>

                {/* Total Transactions */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-success shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Total Transactions</h5>
                            <h3>{transactions.length}</h3>
                            <small>All time</small>
                        </div>
                    </div>
                </div>

                {/* Pending Transactions */}
                <div className="col-md-4 mb-3">
                    <div className="card text-white bg-warning shadow-sm">
                        <div className="card-body">
                            <h5 className="card-title">Pending Transactions</h5>
                            <h3>
                                {transactions.filter((t) => t.status === "PENDING").length}
                            </h3>
                            <small>Awaiting completion</small>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Org Account Details */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-light">
                    <h5 className="mb-0">🏦 Organization Account Details</h5>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-3">
                            <p className="mb-1 fw-bold">Bank Name</p>
                            <p>{orgAccount.bankName}</p>
                        </div>
                        <div className="col-md-3">
                            <p className="mb-1 fw-bold">Branch Number</p>
                            <p>{orgAccount.branchNumber}</p>
                        </div>
                        <div className="col-md-3">
                            <p className="mb-1 fw-bold">Account Number</p>
                            <p>{orgAccount.accountNumber}</p>
                        </div>
                        <div className="col-md-3">
                            <p className="mb-1 fw-bold">Balance</p>
                            <p className="text-success fw-bold">
                                ${orgAccount.balance.toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ✅ Last 5 Transactions */}
            <div className="card shadow-sm">
                <div className="card-header bg-light">
                    <h5 className="mb-0">📜 Last 5 Transactions</h5>
                </div>
                <div className="card-body p-0">
                    {lastFiveTransactions.length === 0 ? (
                        <p className="text-center p-3">No recent transactions found.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-striped mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Category</th>
                                        <th>Payee</th>
                                        <th>Customer</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                        <th>Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lastFiveTransactions.map((t) => (
                                        <tr key={t._id}>
                                            <td>{t.category}</td>
                                            <td>
                                                {t.payeeId
                                                    ? `${t.payeeId.firstName} ${t.payeeId.lastName}`
                                                    : "-"}
                                            </td>
                                            <td>
                                                {t.customerId
                                                    ? `${t.customerId.firstName} ${t.customerId.lastName}`
                                                    : "-"}
                                            </td>
                                            <td>
                                                <strong>${t.amount.toFixed(2)}</strong>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge ${
                                                        t.status === "DONE"
                                                            ? "bg-success"
                                                            : "bg-warning text-dark"
                                                    }`}
                                                >
                                                    {t.status}
                                                </span>
                                            </td>
                                            <td>{getDateFormat(t.createdAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Home;
