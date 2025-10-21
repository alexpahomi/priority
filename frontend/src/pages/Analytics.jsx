import { useEffect, useState } from "react";
import SearchPanel from "../components/SearchPanel";
import VisitationsGrid from "../components/VisitationsGrid";

export default function Analytics() {
  const [hotels, setHotels] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filters, setFilters] = useState({
    hotelIds: [],
    month: "",
    onlyLoyal: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHotels();
  }, []);
  useEffect(() => {
    fetchVisits(filters);
  }, [filters]);

  const fetchHotels = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/hotel");
      if (!response.ok) throw new Error("Failed to fetch hotels");
      const data = await response.json();
      setHotels(data);
    } catch (err) {
      setError("Failed to load hotels");
      console.error(err);
    }
  };

  const fetchVisits = async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (filters.hotelIds.length > 0) {
        params.append("hotelIds", filters.hotelIds.join(","));
      }
      if (filters.month) {
        params.append("month", filters.month);
      }
      if (filters.onlyLoyal) {
        params.append("onlyLoyal", "true");
      }

      const response = await fetch(
        `http://localhost:5000/api/visit/filtered?${params.toString()}`
      );
      if (!response.ok) throw new Error("Failed to fetch visits");

      const data = await response.json();
      setVisits(data);
    } catch (err) {
      setError("Failed to load visits. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <h1>Analytics Page</h1>
      <p className="text-muted">Track and analyze customer hotel visits</p>
      <SearchPanel hotels={hotels} onSearch={handleSearch} />

      {error && (
        <div
          className="alert alert-danger alert-dismissible fade show"
          role="alert"
        >
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading visits...</p>
        </div>
      ) : (
        <VisitationsGrid visits={visits} />
      )}
    </>
  );
}
