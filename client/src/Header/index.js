import React, { Component } from 'react';
import MusicControl from '../MusicControl';

class Header extends Component {

  render () {
    return (
      <div style={{ backgroundColor : "#221F20", height: '5vh'}}>
        <div style={{width:"10%",float:"right"}}>
          <MusicControl changeVolume={this.props.changeVolume}/>
        </div>
      </div>
    )
  }
}

export default Header;
