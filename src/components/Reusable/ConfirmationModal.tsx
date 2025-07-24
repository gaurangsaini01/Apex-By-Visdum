// ConfirmationModal.tsx
import type { ReactNode } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface ModalProps {
    title: string;
    desc: string|ReactNode;
    onClose: () => void
    onSubmit: () => void
    closeText: string
    submitText: string
    show: boolean
    disableState?:boolean
}

function ConfirmationModal({ title, desc, onClose, onSubmit, closeText, submitText, show,disableState }: ModalProps) {
    return (
        <Modal centered show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                {typeof desc === 'string' ? <p>{desc}</p> : desc}
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={onClose} variant="outline-secondary">{closeText}</Button>
                <Button  disabled={disableState} onClick={onSubmit} variant="primary">{submitText}</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
