import { useFetch } from "../hooks/useFetch";
import classes from "./Welcome.module.css";

// Format the description text with proper line breaks and styling
const formatDescription = (text) => {
  if (!text) return null;

  return text.split("\n").map((line, index) => {
    // Check if line is a heading (starts with numbers or **text**)
    if (line.match(/^\d+\./)) {
      return (
        <h3 key={index} className={classes["section-heading"]}>
          {line}
        </h3>
      );
    }
    if (line.match(/^\*\*/)) {
      return (
        <h4 key={index} className={classes["subsection-heading"]}>
          {line.replace(/\*\*/g, "")}
        </h4>
      );
    }
    if (line.trim() === "") {
      return <br key={index} />;
    }
    return (
      <p key={index} className={classes["description-line"]}>
        {line}
      </p>
    );
  });
};

const requestConfig = {}; // defined ext because it's used as dependency in useFetch

export default function Welcome() {
  const {
    data: assignment,
    isLoading: loading,
    error,
  } = useFetch("http://localhost:5000/api/assignment", requestConfig, null);

  if (loading) {
    return (
      <div className="welcome-container">
        <div className="loading">Loading interview assignment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="welcome-container">
        <div className="error">
          <h2>Error</h2>
          <p>{error}</p>
          <p>
            Make sure the backend server is running on &nbsp;
            <a href="http://localhost:5000">http://localhost:5000</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes["welcome-container"]}>
      <div className={classes["welcome-header"]}>
        <h1>{assignment?.title}</h1>
        <div className={classes["assignment-meta"]}>
          <span className={classes.duration}>
            ⏱️ Duration: {assignment?.duration}
          </span>
          <span className={classes.contact}>
            📧 Contact: {assignment?.contact}
          </span>
        </div>
      </div>

      <div className={classes["assignment-content"]}>
        {formatDescription(assignment?.description)}
      </div>

      <div className={classes["welcome-footer"]}>
        <p>This assignment is fetched from the .NET Core 8 backend API</p>
        <code>GET http://localhost:5000/api/assignment</code>
      </div>
    </div>
  );
}
