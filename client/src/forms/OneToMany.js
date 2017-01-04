import React, { Component, PropTypes } from 'react';
import { Label } from 'react-bootstrap';

// Define a custom component for handling the root position object
export default class OneToMany extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.formData };
  }

  /*
  onChange(name) {
    return (event) => {
      this.setState({
        [name]: parseFloat(event.target.value)
      }, () => this.props.onChange(this.state));
    };
  }*/

  render() {
    const { title } = this.props;

    //        <Label label={title} required={required} id={id}/>
    return (
      <div>
        <Label label={title} />
      </div>
    );
  }
}
