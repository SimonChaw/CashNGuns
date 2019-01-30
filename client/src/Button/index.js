import './index.css';
import React, { Component } from 'react';

class Button extends Component {
  render(){
    return(
      <span onClick={this.props.onClick} className="button" style={this.props.style ? this.props.style : {fontSize:"1.3rem"}}>{this.props.title}</span>
    )
  }
}

export default Button;
