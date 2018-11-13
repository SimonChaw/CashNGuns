import React, { Component } from 'react';

class MusicControl extends Component {

  constructor(props){
    super(props)

    this.state = {
      muted : false,
      currentVolume : 50,
      lastVolume : 50,
    }

    this.handleVolumeChange = this.handleVolumeChange.bind(this)
  }

  handleVolumeChange(e, toggle = false){
    let value;

    if (toggle) {
      value = this.state.muted ? this.state.lastVolume : 0
    } else {
      value = e.target.value
    }


    this.setState((state) => {
      return {
        lastVolume : this.state.currentVolume,
        currentVolume : value,
        muted : value == 0
      };
    });

    this.props.changeVolume(value)
  }

  render () {
    return (
      <div style={{width:"100%", display:"flex",flexDirection:"row",width:"7vw",height:"5vh", alignItems:"center"}}>
        <img src={this.state.muted ? "/Volume_Off-512.png" : "/Volume-512.png"} style={{height:"3vh"}} onClick={()=>{this.handleVolumeChange(undefined, true)}}/>
        <input style={{height:"3vh",width:"7vw"}} onChange={this.handleVolumeChange} type="range" min="0" max="100" className="slider" id="myRange" />
      </div>
    )
  }
}

export default MusicControl;
