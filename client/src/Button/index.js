import './index.css';
import React, { Component } from 'react';

class Button extends Component {
  render(){
    return(
      <span style={{fontSize:"1.3rem"}} className="button">{this.props.title}</span>
    )
  }
}

export default Button;
