import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

type ModalProps = {
  show: boolean;
  handleClose: () => void;
  handleSubmit: () => void;
  children: React.ReactNode;
  title: string;
};
function DeleteModal({
  show,
  handleClose,
  handleSubmit,
  children,
  title,
}: ModalProps) {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{children}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          No
        </Button>
        <Button variant="danger" onClick={handleSubmit}>
          Yes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
