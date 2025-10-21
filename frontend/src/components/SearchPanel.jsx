import { useState, useRef, useEffect } from "react";
import DatePicker from "./UI/DatePicker";

export default function SearchPanel({ hotels = [], onSearch }) {
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [onlyLoyal, setOnlyLoyal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleHotelToggle(hotelId) {
    setSelectedHotels((prev) =>
      prev.includes(hotelId)
        ? prev.filter((id) => id !== hotelId)
        : [...prev, hotelId]
    );
  }

  function handleSearch() {
    onSearch({
      hotelIds: selectedHotels,
      selectedDate,
      onlyLoyal,
    });
  }

  function handleSelectAll() {
    if (selectedHotels.length === hotels.length) {
      setSelectedHotels([]);
    } else {
      setSelectedHotels(hotels.map((h) => h.id));
    }
  }

  function getSelectedHotelNames() {
    if (selectedHotels.length === 0) return "Select Hotels";
    if (selectedHotels.length === hotels.length) return "All Hotels";
    if (selectedHotels.length === 1) {
      return hotels.find((h) => h.id === selectedHotels[0])?.name || "";
    }
    return `${selectedHotels.length} Hotels Selected`;
  }

  return (
    <div className="card bg-white mb-3 rounded shadow-sm border">
      <div className="card-body">
        <h5 className="card-title mb-3">Search Filters</h5>
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <label className="form-label fw-semibold">Hotels</label>
            <div ref={dropdownRef} className="dropdown w-100">
              <button
                className="btn btn-outline-secondary dropdown-toggle w-100 text-start d-flex justify-content-between align-items-center"
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <span className="text-truncate">{getSelectedHotelNames()}</span>
              </button>
              {showDropdown && (
                <div
                  className="dropdown-menu show w-100 p-2"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <div className="form-check mb-2 border-bottom pb-2">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="selectAll"
                      checked={selectedHotels.length === hotels.length}
                      onChange={handleSelectAll}
                    />
                    <label
                      className="form-check-label fw-bold"
                      htmlFor="selectAll"
                    >
                      Select All
                    </label>
                  </div>
                  {hotels.map((hotel) => (
                    <div key={hotel.id} className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`hotel-${hotel.id}`}
                        checked={selectedHotels.includes(hotel.id)}
                        onChange={() => handleHotelToggle(hotel.id)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`hotel-${hotel.id}`}
                      >
                        {hotel.name}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Month/Year</label>
            <DatePicker
              className="form-control"
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label fw-semibold">Customers</label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="loyalCheck"
                checked={onlyLoyal}
                onChange={(e) => setOnlyLoyal(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="loyalCheck">
                Show Loyal Customers Only
              </label>
            </div>
          </div>

          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-primary w-100" onClick={handleSearch}>
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
