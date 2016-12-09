import React, { Component, PropTypes } from 'react';
import { Modal, Button } from 'react-bootstrap';
import {modalify} from 'react-modalify';

export default class AlertBox extends Component {

  constructor(props) {
    super(props);
    this.state = {show: true};
  }

  closeAndReturn(result) {
    this.setState({show: false});
    this.props.close(result);
  }

  render() {
    const { yes, no } = this.props;

    return (
      <div className="static-modal">
        <Modal show={this.state.show}>
          <Modal.Header>
            <Modal.Title>{this.props.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {this.props.children}
          </Modal.Body>

          <Modal.Footer>
            {yes && <Button onClick={this.closeAndReturn.bind(this, yes)} bsStyle="primary">{yes}</Button>}
            {no  && <Button onClick={this.closeAndReturn.bind(this, no)}>{no}</Button>}
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

  static askYesNo({title, body, yes, no}) {
    return modalify((props) => (
      <AlertBox title={title} yes={yes} no={no} {...props}>
        {body}
      </AlertBox>
    ))();
  }

  static error(error) {
    return modalify((props) => (
      <AlertBox title={<i className="glyphicon glyphicon-exclamation-sign">Error</i>} yes={'ok'} {...props}>
        {error}
      </AlertBox>
    ))();
  }

}

AlertBox.propTypes = {
  close: PropTypes.func.isRequired,
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
  yes: PropTypes.string,
  no: PropTypes.string,
};
