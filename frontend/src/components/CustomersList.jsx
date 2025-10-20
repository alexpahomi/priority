import { Link } from "react-router";
import classes from "./CustomersList.module.css";

function CustomersList({ customers }) {
  return (
    <div className={classes.customers}>
      <h1>Customers</h1>

      <table>
        <thead>
          <th>Id</th>
          <th>Name</th>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr>
              <td>{customer.id}</td>
              <td>
                <Link to={`/customers/${customer.id}`}>
                  {customer.name}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default CustomersList;
