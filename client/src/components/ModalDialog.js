import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Modal dialog.
 */
export default function ModalDialog(props) {
  return (
    <Modal show={props.show} onHide={props.onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {props.children}
      </Modal.Body>

      <Modal.Footer>
        {props.additionalButton}
        <Button onClick={props.onClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalDialog.propTypes = {
  show: PropTypes.bool.isRequired,
  title: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  additionalButton: PropTypes.element,
  children: React.PropTypes.element.isRequired,
};
