import { useRef, useEffect, useImperativeHandle } from "react";
import { createPortal } from "react-dom";
import classes from "./Modal.module.css";

export default function Modal({
  ref,
  children,
  className = "",
}) {
  const dialog = useRef();

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
      close() {
        dialog.current.close();
      },
    };
  });

  return createPortal(
    <dialog
      ref={dialog}
      className={`${classes.modal} ${className}`}
    >
      {children}
    </dialog>,
    document.getElementById("modal")
  );
}
