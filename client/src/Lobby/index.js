import React, { Component } from 'react';
import Button from '../Button';

class Lobby extends Component {
    render(){
      return (
        <div style={{height:'95vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', }}>
          <Button title={'NEW GAME'}/>
          <Button title={'JOIN GAME'}/>
        </div>
      )
    }
}

export default Lobby;
