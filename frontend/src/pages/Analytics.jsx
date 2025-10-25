import { useState } from "react";
import { useFetch } from "../hooks/useFetch";
import SearchPanel from "../components/SearchPanel";
import VisitationsGrid from "../components/VisitationsGrid";
import Alert from "../components/UI/Alert";

const getRequestConfig = {}; // defined ext because it's used as dependency in useFetch

export default function Analytics() {
  const [filters, setFilters] = useState({
    hotelIds: [],
    month: "",
    onlyLoyal: false,
  });

  const {
    data: hotels,
    isLoading: hotelsLoading,
    error: hotelsError,
    clearError: clearHotelsError,
  } = useFetch("http://localhost:5000/api/hotel", getRequestConfig, []);

  // build dynamic visits URL from filters
  const queryParams = new URLSearchParams();
  if (filters.hotelIds.length > 0) {
    queryParams.append("hotelIds", filters.hotelIds.join(","));
  }
  if (filters.month) {
    const date = new Date(filters.month);
    const monthStr = String(date.getMonth() + 1).padStart(2, "0");
    queryParams.append("month", `${monthStr}/${date.getFullYear()}`);
  }
  if (filters.onlyLoyal) {
    queryParams.append("onlyLoyal", "true");
  }

  const visitUrl = `http://localhost:5000/api/visit/filtered?${queryParams.toString()}`;

  const {
    data: visits,
    isLoading: visitsLoading,
    error: visitsError,
    clearError: clearVisitsError,
  } = useFetch(visitUrl, getRequestConfig, [], [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <h1>Analytics Page</h1>
      <p className="text-muted">Track and analyze customer hotel visits</p>
      {hotelsLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading hotels...</p>
        </div>
      ) : (
        <SearchPanel hotels={hotels} onSearch={handleSearch} />
      )}

      {hotelsError && (
        <Alert type="danger" onDismiss={clearHotelsError}>
          {hotelsError}
        </Alert>
      )}

      {visitsError && (
        <Alert type="danger" onDismiss={clearVisitsError}>
          {visitsError}
        </Alert>
      )}

      {visitsLoading ? (
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
