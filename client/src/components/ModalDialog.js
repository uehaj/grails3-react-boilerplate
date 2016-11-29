import React, { Component } from 'react';
import { Modal, Button } from 'react-bootstrap';

/**
 * Modal dialog.
 */
export default class ModalDialog extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.close}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.title}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {this.props.children}
        </Modal.Body>

        <Modal.Footer>
          {this.props.additionalButton}
          <Button onClick={this.props.close}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
