import React, { Component, PropTypes } from 'react';

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
    return (
      <div>
        HOGE
      </div>
    );
  }
}
