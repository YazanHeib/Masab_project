import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useGetPayeesQuery, useDeletePayeeMutation } from "../redux/api/payeeAPI";
import { Notif } from "../components/Notif";

const Payees = () => {
    const navigate = useNavigate();
    const { data: payees, isLoading, isError, error, refetch } = useGetPayeesQuery();
    const [deletePayee] = useDeletePayeeMutation();
    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");

    useEffect(() => {
        refetch();
    }, [refetch]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this payee?")) {
            try {
                await deletePayee(id).unwrap();
                setMessage("Payee deleted successfully!");
                setStyle("primary");
                refetch();
            } catch (err) {
                setMessage(err?.data?.message || "Failed to delete payee");
                setStyle("danger");
            }
        }
    };

    const columns = [
        { name: "Type", selector: (row) => row.type, sortable: true },
        { name: "First Name", selector: (row) => row.firstName, sortable: true },
        { name: "Last Name", selector: (row) => row.lastName, sortable: true },
        { name: "Bank", selector: (row) => row.bank, sortable: true },
        { name: "Branch", selector: (row) => row.branch, sortable: true },
        { name: "Account", selector: (row) => row.account, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <i
                        className="bx bx-edit"
                        style={{ cursor: "pointer", color: "blue", fontSize: "18px" }}
                        onClick={() => navigate(`/payees/update/${row._id}`)}
                    ></i>
                    <i
                        className="bx bx-trash"
                        style={{ cursor: "pointer", color: "red", fontSize: "18px" }}
                        onClick={() => handleDelete(row._id)}
                    ></i>
                </div>
            ),
        },
    ];

    if (isLoading) return <p>Loading payees...</p>;
    if (isError) return <p>Error: {error?.data?.message || "Failed to load payees"}</p>;

    return (
        <section id="main-content">
            <h1>Payees</h1>
            <Notif message={message} style={style} />

            <div style={{ marginBottom: "15px" }}>
                <Link to="/payees/create" className="btn">
                    + Create Payee
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={payees || []}
                pagination
                highlightOnHover
                striped
                responsive
                persistTableHead
            />
        </section>
    );
};

export default Payees;
