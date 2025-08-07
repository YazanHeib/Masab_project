import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Link, useNavigate } from "react-router-dom";
import { useGetCustomersQuery, useDeleteCustomerMutation } from "../redux/api/customerAPI";
import { Notif } from "../components/Notif";

const Customers = () => {
    const navigate = useNavigate();
    const { data: customers, isLoading, isError, error, refetch } = useGetCustomersQuery();
    const [deleteCustomer] = useDeleteCustomerMutation();
    const [message, setMessage] = useState("");
    const [style, setStyle] = useState("");

    useEffect(() => {
        if (isError) {
            setMessage(error?.data?.message || "Failed to fetch customers");
            setStyle("danger");
        }
    }, [isError, error]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                await deleteCustomer(id).unwrap();
                setMessage("Customer deleted successfully!");
                setStyle("primary");
                refetch();
            } catch (err) {
                setMessage(err?.data?.message || "Failed to delete customer");
                setStyle("danger");
            }
        }
    };

    const columns = [
        { name: "First Name", selector: (row) => row.firstName, sortable: true },
        { name: "Last Name", selector: (row) => row.lastName, sortable: true },
        { name: "Bank", selector: (row) => row.bank, sortable: true },
        { name: "Branch", selector: (row) => row.branch, sortable: true },
        { name: "Account", selector: (row) => row.account, sortable: true },
        { name: "Email", selector: (row) => row.email, sortable: true },
        // { name: "Status", selector: (row) => (row.isActive ? "Active" : "Inactive"), sortable: true },
        {
            name: "Actions",
            cell: (row) => (
                <div style={{ display: "flex", gap: "10px" }}>
                    <i
                        className="bx bx-edit"
                        style={{ cursor: "pointer", color: "blue", fontSize: "18px" }}
                        title="Edit"
                        onClick={() => navigate(`/customers/update/${row._id}`)}
                    ></i>
                    <i
                        className="bx bx-trash"
                        style={{ cursor: "pointer", color: "red", fontSize: "18px" }}
                        title="Delete"
                        onClick={() => handleDelete(row._id)}
                    ></i>
                </div>
            ),
        },
    ];

    if (isLoading) return <p>Loading customers...</p>;

    return (
        <section id="main-content">
            <h3>
                Customers
            </h3>
            <Notif message={message} style={style} />

            <div style={{ marginBottom: "15px" }}>
                <Link to="/customers/create" className="btn">
                    + Create Customer
                </Link>
            </div>

            <DataTable
                columns={columns}
                data={customers || []}
                pagination
                highlightOnHover
                striped
                responsive
                persistTableHead
            />
        </section>
    );
};

export default Customers;
