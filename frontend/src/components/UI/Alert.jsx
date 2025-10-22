import { useState } from "react";

export default function Alert({ type = "info", children, onDismiss }) {
  const [visible, setVisible] = useState(true);

  function handleDismiss() {
    setVisible(false);
    if (onDismiss) onDismiss();
  }

  if (!visible) return null;

  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
    >
      {children}
      <button
        type="button"
        className="btn-close"
        onClick={handleDismiss}
        aria-label="Close"
      ></button>
    </div>
  );
}
