import { Link } from "react-router";
import { formatDate } from "../utils/formatting";

function CustomersGrid({ customers }) {
  const content =
    customers && customers.length > 0 ? (
      <table className="table table-striped table-hover">
        <thead className="table-dark">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Email</th>
            <th>Registration Date</th>
            <th>Total Purchases</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td>{customer.id}</td>
              <td>
                <Link to={`/customers/profile/${customer.id}`}>
                  {customer.name}
                </Link>
              </td>
              <td>{customer.email}</td>
              <td>{formatDate(customer.registrationDate)}</td>
              <td>{customer.totalPurchases}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ) : (
      <div className="alert alert-info text-center" role="alert">
        <p className="mb-0">
          No customers found. Create your first customer profile!
        </p>
        <Link to="/customers/profile" className="btn btn-primary btn-sm mt-3">
          Create Customer
        </Link>
      </div>
    );

  return (
    <>
      <h1 className="text-center">Customers</h1>
      <Link to="profile/" className="btn btn-sm btn-dark mb-3">
        Create Customer
      </Link>
      {content}
    </>
  );
}

export default CustomersGrid;
