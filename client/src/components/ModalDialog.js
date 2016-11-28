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
          <Button bsStyle="primary" onClick={this.props.close}>Close</Button>
          {this.props.additionalButton}
        </Modal.Footer>
      </Modal>
    );
  }
}
