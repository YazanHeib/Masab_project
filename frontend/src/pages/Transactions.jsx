import { useNavigate } from "react-router-dom";
import { useGetTransactionsQuery } from "../redux/api/transferAPI";
import DataTable from "react-data-table-component";
import { useEffect, useState, useMemo } from "react";
import { getDateFormat } from "../utils/Utils";

const Transactions = () => {
    const { data, isLoading, isError } = useGetTransactionsQuery();
    const navigate = useNavigate();

    const transactions = data?.transactions || [];

    // ✅ Filters state
    const [categoryFilter, setCategoryFilter] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const handleDownload = async (transactionId) => {
        try {
            const response = await fetch(
                `${import.meta.env.VITE_SERVER_ENDPOINT}/api/transactions/${transactionId}/receipt`,
                {
                    method: "GET",
                    headers: {
                        Accept: "application/pdf",
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to download receipt");
            }

            // Convert response to Blob
            const blob = await response.blob();

            // Create download link
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `transaction_${transactionId}.pdf`; // File name
            document.body.appendChild(a);
            a.click();

            // Clean up
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("❌ Download failed:", error);
        }
    };

    // ✅ Define columns for DataTable
    const columns = [
        {
            name: "Category",
            selector: (row) => row.category,
            sortable: true,
        },
        {
            name: "Payee",
            selector: (row) =>
                row.payeeId ? `${row.payeeId.firstName} ${row.payeeId.lastName}` : "-",
        },
        {
            name: "Customer",
            selector: (row) =>
                row.customerId ? `${row.customerId.firstName} ${row.customerId.lastName}` : "-",
        },
        {
            name: "Amount",
            selector: (row) => `$${row.amount.toFixed(2)}`,
            sortable: true,
        },
        {
            name: "Created At",
            selector: (row) => `${getDateFormat(row.createdAt)}`,
            sortable: true,
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span
                    className={`badge ${row.status === "DONE" ? "badge-success" : "badge-warning"}`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            name: "Action",
            cell: (row) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    {/* View Button */}
                    <button
                        className="btn-icon"
                        title="View Transaction"
                        onClick={() => navigate(`/transactions/${row._id}`)}
                    >
                        <i className="bx bx-show"></i>
                    </button>

                    {/* Download PDF Button */}
                    <button
                        className="btn-icon"
                        title="Download Receipt"
                        onClick={() => handleDownload(row._id)}
                    >
                        <i className="bx bx-download"></i>
                    </button>
                </div>
            ),
            ignoreRowClick: true,
        },
    ];

    // ✅ Apply Filters
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            let isCategoryMatch = true;
            let isDateMatch = true;

            if (categoryFilter) {
                isCategoryMatch = t.category === categoryFilter;
            }

            if (startDate || endDate) {
                const transactionDate = new Date(t.createdAt);
                if (startDate && transactionDate < new Date(startDate)) {
                    isDateMatch = false;
                }
                if (endDate && transactionDate > new Date(endDate)) {
                    isDateMatch = false;
                }
            }

            return isCategoryMatch && isDateMatch;
        });
    }, [transactions, categoryFilter, startDate, endDate]);

    useEffect(() => {
        if (isError) {
            console.error("❌ Failed to load transactions");
        }
    }, [isError]);

    return (
        <section id="main-content">
            <h1>📜 Transactions</h1>

            {/* ✅ Filters */}
            <div className="filters" style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    <option value="SALARY">Salary</option>
                    <option value="SUPPLIER">Supplier</option>
                    <option value="PENSION">Pension</option>
                    <option value="CHARGE">Charge</option>
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />

                <button
                    className="btn"
                    onClick={() => {
                        setCategoryFilter("");
                        setStartDate("");
                        setEndDate("");
                    }}
                >
                    Reset Filters
                </button>
            </div>

            {isLoading && <p>Loading transactions...</p>}

            {!isLoading && filteredTransactions.length === 0 && (
                <p>No transactions found for the selected filters.</p>
            )}

            {!isLoading && filteredTransactions.length > 0 && (
                <DataTable
                    columns={columns}
                    data={filteredTransactions}
                    pagination
                    highlightOnHover
                    striped
                />
            )}
        </section>
    );
};

export default Transactions;
