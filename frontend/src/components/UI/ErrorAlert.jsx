export default function ErrorAlert({ children, onDismiss }) {
  return (
    <div className="alert alert-danger alert-dismissible fade show" role="alert">
      {children}
      <button
        type="button"
        className="btn-close"
        onClick={onDismiss}
        aria-label="Close"
      ></button>
    </div>
  );
}
