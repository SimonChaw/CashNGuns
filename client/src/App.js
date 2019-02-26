import React, { Component } from 'react';
import logo from './logo.svg';
import Header from './Header';
import LoadingScreen from './Loading';
import Lobby from './Lobby';
import GameScreen from './GameScreen';
import './App.css';

class App extends Component {
  constructor(props){
    super(props)
    //let socket = openSocket('http://localhost:4200');
    this.state = {
      loaded : false,
      currentScreen : 'loading',
      assetManifest : {},
      volumeLevel : 50
    }
    // Binding
    this.onLoaded = this.onLoaded.bind(this)
    this.changeVolume = this.changeVolume.bind(this)
  }

  onLoaded(assetManifest){
    console.log('Loaded!');
    this.setState({currentScreen : 'lobby', assetManifest : assetManifest, loaded:true})
  }

  changeVolume(volumeLevel){
    this.state.assetManifest.audio.forEach((sound) => {
      sound.volume = volumeLevel / 100
    })
    this.state.assetManifest.audio[0].play();
  }


  componentDidMount(){

  }

  render() {
    return (
      <div className="App">
        <Header changeVolume={this.changeVolume}/>

        {this.state.currentScreen == "loading" &&
            <LoadingScreen handleLoad={this.onLoaded} />
        || this.state.currentScreen == "lobby" &&
            <GameScreen assetManifest={this.state.assetManifest} />
        ||
            null
        }
      </div>
    );
  }
}

export default App;
