import { useNavigate } from "react-router-dom";
import { useGetTransactionsQuery } from "../redux/api/transferAPI";
import DataTable from "react-data-table-component";
import { useEffect } from "react";

const Transactions = () => {
    const { data: transactions = [], isLoading, isError } = useGetTransactionsQuery();
    const navigate = useNavigate();

    const columns = [
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.category,
            sortable: true,
        },
        {
            name: "Payee",
            selector: (row) => row.payeeId ? row.payeeId.firstName + " " + row.payeeId.lastName : "-",
        },
        {
            name: "Customer",
            selector: (row) => row.customerId ? row.customerId.firstName + " " + row.customerId.lastName : "-",
        },
        {
            name: "Amount",
            selector: (row) => `$${row.amount.toFixed(2)}`,
            sortable: true,
            right: true
        },
        {
            name: "Status",
            selector: (row) => row.status,
            sortable: true,
            cell: (row) => (
                <span className={`status ${row.status === "DONE" ? "done" : "pending"}`}>
                    {row.status}
                </span>
            )
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn-icon"
                    title="View Transaction"
                    onClick={() => navigate(`/transactions/${row._id}`)}
                >
                    <i className="bx bx-show"></i>
                </button>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true
        }
    ];

    useEffect(() => {
        if (isError) {
            console.error("Failed to load transactions");
        }
    }, [isError]);

    return (
        <section id="main-content">
            <h1>Transactions</h1>
            {isLoading ? (
                <p>Loading transactions...</p>
            ) : (
                <DataTable
                    columns={columns}
                    data={transactions}
                    pagination
                    highlightOnHover
                    striped
                />
            )}
        </section>
    );
};

export default Transactions;
