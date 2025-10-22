import { useEffect, useState } from "react";
import SearchPanel from "../components/SearchPanel";
import VisitationsGrid from "../components/VisitationsGrid";
import Alert from "../components/UI/Alert";

export default function Analytics() {
  const [hotels, setHotels] = useState([]);
  const [visits, setVisits] = useState([]);
  const [filters, setFilters] = useState({
    hotelIds: [],
    month: "",
    onlyLoyal: false,
  });

  const [hotelsLoading, setHotelsLoading] = useState(true);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [hotelsError, setHotelsError] = useState(null);
  const [visitsError, setVisitsError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchHotels = async () => {
      setHotelsLoading(true);
      setHotelsError(null);
      try {
        const response = await fetch("http://localhost:5000/api/hotel", {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok)
          throw new Error(date.error || "Failed to fetch hotels");
        setHotels(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setHotelsError(err.message || "Failed to load hotels");
        }
      } finally {
        setHotelsLoading(false);
      }
    };

    fetchHotels();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const fetchVisits = async () => {
      setVisitsLoading(true);
      setVisitsError(null);

      try {
        const params = new URLSearchParams();

        if (filters.hotelIds.length > 0) {
          params.append("hotelIds", filters.hotelIds.join(","));
        }
        if (filters.month) {
          const date = new Date(filters.month);
          const monthStr = String(date.getMonth() + 1).padStart(2, "0");
          params.append("month", `${monthStr}/${date.getFullYear()}`);
        }
        if (filters.onlyLoyal) {
          params.append("onlyLoyal", "true");
        }

        const response = await fetch(
          `http://localhost:5000/api/visit/filtered?${params.toString()}`,
          { signal: controller.signal }
        );
        
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "Failed to fetch visits");

        setVisits(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setVisitsError(err.message || "Failed to load visits.");
        }
      } finally {
        setVisitsLoading(false);
      }
    };

    fetchVisits();
    return () => controller.abort();
  }, [filters]);

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
        <Alert type="danger" onDismiss={() => setHotelsError(null)}>
          {hotelsError}
        </Alert>
      )}

      {visitsError && (
        <Alert type="danger" onDismiss={() => setVisitsError(null)}>
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
