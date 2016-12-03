import React, { PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Modal dialog.
 */
export default function ModalDialog(props) {
  return (
    <Modal show={props.show} onHide={props.close}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {props.children}
      </Modal.Body>

      <Modal.Footer>
        {props.additionalButton}
        <Button onClick={props.close}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalDialog.propTypes = {
  title: PropTypes.string.isRequired,
  show: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  additionalButton: PropTypes.element.isRequired,
  children: React.PropTypes.element.isRequired,
};
