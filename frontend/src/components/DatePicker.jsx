import React, { useState, useEffect } from "react";
import classes from "./DatePicker.module.css";

const supportsMonthInput = (() => {
  const test = document.createElement("input");
  test.type = "month";
  return test.type === "month";
})();

const monthArr = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function DatePicker({ selectedDate, onDateChange, ...props }) {
  const [month, selectMonth] = useState(new Date().getMonth());
  const [year, selectYear] = useState(new Date().getFullYear());

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 101 }, (_, i) => currentYear - i);

  function handleSelectMonth(e) {
    const selectedMonth = parseInt(e.target.value, 10);
    selectMonth(selectedMonth);
    notifyChange(selectedMonth, year);
  }

  function handleSelectYear(e) {
    const selectedYear = parseInt(e.target.value, 10);
    selectYear(selectedYear);
    notifyChange(month, selectedYear);
  }

  function notifyChange(m, y) {
    if (typeof onDateChange === "function") {
      const selected = new Date(y, m, 1);
      onDateChange(selected);
    }
  }

  const picker = supportsMonthInput ? (
    <input className={classes.nativeDatePicker}
      type="month"
      id="month-visit"
      name="month-visit"
      {...props}
      onChange={(e) => {
        const [y, m] = e.target.value.split("-");
        selectMonth(parseInt(m, 10) - 1);
        selectYear(parseInt(y, 10));
        notifyChange(parseInt(m, 10) - 1, parseInt(y, 10));
      }}
    />
  ) : (
    <div className={classes.fallbackDatePicker}>
      <select
        id="month"
        name="month"
        onChange={handleSelectMonth}
        value={month}
        {...props}
      >
        {monthArr.map((name, index) => (
          <option key={index} value={index}>
            {name}
          </option>
        ))}
      </select>
      <select
        id="year"
        name="year"
        onChange={handleSelectYear}
        value={year}
        {...props}
      >
        {yearOptions.map((yearValue) => (
          <option key={yearValue} value={yearValue}>
            {yearValue}
          </option>
        ))}
      </select>
    </div>
  );

  return <>{picker}</>;
}
