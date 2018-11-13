import React, { Component } from 'react';
import Game from '../Game';
import './index.css';

class GameScreen extends Component {
  constructor(props){
    super(props)

    this.state = {
      gameWidth : 0,
      gameHeight : 0
    }

    this.getStageDimension = this.getStageDimension.bind(this)
  }

  componentDidMount() {
    this.getStageDimension()
    window.func = this.getStageDimension;
    window.addEventListener('resize', function(event){
      this.func()
    });
  }

  getStageDimension(){
    var d = document,
      g = d.getElementById('gameWindow'),
      x = g.clientWidth,
      y = g.clientHeight;

      this.setState({
        gameWidth : g.clientWidth,
        gameHeight : g.clientHeight
      })
  }

  render(){
    return(
      <div style={{height:'95vh', display:'flex', flexDirection:'row'}}>
        <div style={{display:'flex', flexDirection:'column', width:'70vw'}}>
          <div id="gameWindow" style={{border:'2px solid black', height:'75vh'}}>
            <Game requestRefresh={this.getStageDimension} height={this.state.gameHeight} width={this.state.gameWidth} assetManifest={this.props.assetManifest}/>
          </div>
          <div style={{border:'2px solid black', height:'25vh', backgroundColor:'#221F20', color:'white'}}>
            <div style={{display:'flex', flexDirection:'row', height:'25vh', width:'70vw'}}>
              <div className="icon-card">
                <img style={{width:'10vw'}} src="./Money_Bag_icon.png"/>
                <h3>Loot Cards</h3>
              </div>
              <div style={{display:'flex', flexDirection:'column', justifyContent:'space-evenly', padding:'1rem'}}>
                <h2 style={{color:'green', textAlign:'left', margin:'0'}}>CASH VALUE : $0</h2>
                <h2 style={{color:'red', textAlign:'left', margin:'0'}}>WOUNDS : 0</h2>
                <h2 style={{color:'white', textAlign:'left', margin:'0'}}>BULLETS : 3</h2>
                <h2 style={{color:'white', textAlign:'left', margin:'0'}}>BLANKS : 5</h2>
              </div>
            </div>
          </div>
        </div>
        <div style={{display:'flex', flexDirection:'column', width:'30vw'}}>
          <div style={{border:'2px solid black', width:'30vw', height:'95vh'}}>
            <h1>Chat</h1>
          </div>
        </div>
      </div>
    )
  }

}

export default GameScreen;
