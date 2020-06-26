import React, { Component } from 'react';

export default class SquareRenderer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: this.valueLength(),
    };
  }

  valueLength() {
    return this.props.value.length;
  }

  render() {
    return <span>{this.state.value}</span>;
  }
}
