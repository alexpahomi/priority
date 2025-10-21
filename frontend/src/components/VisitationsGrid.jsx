import { Link } from "react-router";
import { formatDate } from "../utils/formatting";

export default function VisitationsGrid({ visits = [] }) {
  return (
    <>
      {visits && visits.length > 0 && (
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Visit ID</th>
              <th>Customer</th>
              <th>Hotel</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id}>
                <td>{visit.id}</td>
                <td>
                  <Link to={`/customers/profile/${visit.customerId}`}>
                    {visit.customerName}
                  </Link>
                </td>
                <td>{visit.hotelName}</td>
                <td>{formatDate(visit.visitDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {visits && visits.length === 0 && (
        <div className="text-center py-5 text-muted">
          <p>No visits found matching your criteria</p>
        </div>
      )}
    </>
  );
}
