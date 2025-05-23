import Toast from "react-bootstrap/Toast";
import ToastContainer from "react-bootstrap/ToastContainer";
import type { CustomToastProps } from "../models/common";

const CustomToast = ({
  title,
  message,
  show,
  variant,
  onClose,
}: CustomToastProps) => {
  return (
    <ToastContainer position="top-end" className="p-3">
      <Toast bg={variant} show={show} onClose={onClose} autohide delay={3000}>
        <Toast.Header>
          <strong className="me-auto">{title}</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default CustomToast;
