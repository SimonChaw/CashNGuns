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
    var resumeAudioContext = (function() {
      console.log('here');
    	// handler for fixing suspended audio context in Chrome
    	try {
    		if (window.createjs.WebAudioPlugin.context && window.createjs.WebAudioPlugin.context.state === "suspended") {
    			window.createjs.WebAudioPlugin.context.resume();
    		}
    	} catch (e) {
    		// SoundJS context or web audio plugin may not exist
    		console.error("There was an error while trying to resume the SoundJS Web Audio context...");
    		console.error(e);
    	}
      window.createjs.Sound.play('theme');
    	// Should only need to fire once
    	window.removeEventListener("click", resumeAudioContext);
    }).bind(this);
    window.addEventListener("click", resumeAudioContext);

  }

  changeVolume(volumeLevel){
    window.createjs.Sound.volume = volumeLevel / 100;
  }


  componentDidMount(){

  }

  render() {
    return (
      <div className="App">
        {this.state.currentScreen != "loading" &&
            <Header changeVolume={this.changeVolume}/>
        }
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
