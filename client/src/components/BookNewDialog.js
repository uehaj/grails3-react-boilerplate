import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Col, Button, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap';
import 'react-bootstrap-table/css/react-bootstrap-table.css';
import ModalDialog from './ModalDialog';

/**
 * Form for create Book Domain class on a modal dialog.
 */
export default class BookNewDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: null,
      title: null,
      price: null
    };
  }

  callbackSubmitButtonAction() {
    this.props.submitButtonAction({
      title: ReactDOM.findDOMNode(this.refs.title).value,
      price: ReactDOM.findDOMNode(this.refs.price).value
    });
  }

  render() {
    return (
      <ModalDialog title="New Book"
                   show={this.props.show}
                   close={this.props.close}
                   additionalButton={<Button bsStyle="success" onClick={this.callbackSubmitButtonAction.bind(this)}>Create</Button>}>
        <Form horizontal>
          <FormGroup controlId="formHorizontalTitle">
            <Col componentClass={ControlLabel} sm={2}>
              Title
            </Col>
            <Col sm={10}>
              <FormControl ref='title'
                componentClass='input'
                placeholder="Title" defaultValue={this.state.book && this.state.book.title}/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalPrice">
              <Col componentClass={ControlLabel} sm={2}>
                Price
              </Col>
              <Col sm={10}>
                <FormControl ref='price'
                  componentClass='input'
                  placeholder="Price" defaultValue={this.state.book && this.state.book.price}/>
              </Col>
          </FormGroup>
        </Form>
      </ModalDialog>
    );
  }
}
