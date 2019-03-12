import React, { Component } from 'react';

const image_urls = [
  '/assets/img/cash_5000.png', //0
  '/assets/img/cash_10000.png', // 1
  '/assets/img/cash_20000.png', // 2
  '/assets/img/diamond_1000.png', // 3
  '/assets/img/sprite_test.png', // 4
  '/assets/img/alt-bg.jpg', // 5
  '/assets/img/desk.png', // 6
  '/assets/img/rug.png', // 7
  '/assets/img/painting.png', // 8
  '/assets/img/pop.jpg', // 9
  '/assets/img/bullet.png' // 10
]

const audio_path = "./assets/sound/"

const audio_urls = [
  {src : 'Swing.mp3', id : 'theme'},
  {src : 'bullet.mp3', id : 'bullet'},
]

let assetManifest;
let assetsLoaded = 0
let assetsLength = image_urls.length + 1 // Plus one because SoundJS hits the load callback when all audio urls are loaded.

class LoadingScreen extends Component {

  constructor(props){
    super(props)

    this.loadAssets = this.loadAssets.bind(this)
    this.handleSoundLoad = this.handleSoundLoad.bind(this);
    this.handleImageLoad = this.handleImageLoad.bind(this);
  }

  componentDidMount(){
    this.loadAssets()
  }

  handleImageLoad(event){
    assetManifest.images.push(event.result);
    assetsLoaded +=1;
    if (assetsLoaded === assetsLength) {
      this.props.handleLoad(assetManifest)
    }
  }

  handleSoundLoad(event){
    assetsLoaded += 1;
    console.log(assetsLoaded);
    console.log(assetsLength);
    if (assetsLoaded === assetsLength) {
      this.props.handleLoad(assetManifest)
    }
  }

  loadAssets(){
    let preloader = new window.createjs.LoadQueue();
    assetManifest = {
      images : [],
      audio  : []
    }
    preloader.addEventListener("fileload", this.handleImageLoad);
    image_urls.forEach((image_url) => {
      preloader.loadFile(image_url);
    })
    window.createjs.Sound.alternateExtensions = ["mp3"];
    window.createjs.Sound.on("fileload", this.handleSoundLoad);
    window.createjs.Sound.registerSounds(audio_urls, audio_path);
  }

  render () {
    return (
      <div style={{height:'95vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <img alt="Cash N Guns Logo" src='/Cash-n-Guns-Logo.png' style={{width:'40%', height:'auto'}}/>
        <h2 style={{color:'white'}}>Loading...</h2>
        <div className="bar" style={{width:'40vw'}}></div>
      </div>
    )
  }
}

export default LoadingScreen;
