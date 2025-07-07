// ConfirmationModal.tsx
import { Modal, Button } from 'react-bootstrap';

interface ModalProps{
    title:string;
    desc:string;
    onClose:()=>void
}

function ConfirmationModal({ title, desc, onClose, onSubmit, closeText, submitText, show }:ModalProps) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>{desc}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button onClick={onClose} variant="secondary">{closeText}</Button>
        <Button onClick={onSubmit} variant="primary">{submitText}</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
