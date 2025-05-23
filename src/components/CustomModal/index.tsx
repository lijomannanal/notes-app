import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

type ModalProps = {
  show: boolean;
  handleClose: () => void;
  children: React.ReactNode;
  title: string;
};
function CustomModal({ show, handleClose, title, children }: ModalProps) {
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default CustomModal;
