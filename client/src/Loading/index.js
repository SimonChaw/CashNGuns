import React, { Component } from 'react';

const image_urls = [
  '/assets/img/cash_5000.png',
  '/assets/img/cash_10000.png',
  '/assets/img/cash_20000.png',
  '/assets/img/diamond_1000.png',
  '/assets/img/sprite_test.png',
  '/assets/img/alt-bg.jpg',
  '/assets/img/desk.png',
  '/assets/img/rug.png',
  '/assets/img/painting.png',
]

const audio_urls = [
  '/assets/sound/Swing.mp3',
  '/assets/sound/bullet.mp3'
]

let assetsLoaded = 0
let assetsLength = image_urls.length + audio_urls.length

class LoadingScreen extends Component {

  constructor(props){
    super(props)
    this.state = {
    }
    this.loadAssets = this.loadAssets.bind(this)
    this.handleAssetLoaded = this.handleAssetLoaded.bind(this)
  }

  componentDidMount(){
    this.loadAssets()
  }

  handleAssetLoaded(type, assetManifest, asset){
    assetManifest[type].push(asset)
    assetsLoaded +=1
    console.log(assetsLoaded);
    if (assetsLoaded === assetsLength) {
      this.props.handleLoad(assetManifest)
    }
  }

  loadAssets(){
    let assetManifest = {
      images : [],
      audio  : []
    }

    image_urls.forEach((image_url) => {
      var image = new Image()
      image.src = image_url
      image.alt = image_url
      image.addEventListener("loadeddata", this.handleAssetLoaded('images', assetManifest, image))
    })

    audio_urls.forEach((audio_url) => {
      var audio = new Audio();
      audio.src = audio_url
      audio.addEventListener("loadeddata", this.handleAssetLoaded('audio', assetManifest, audio))
    })
  }

  render () {
    return (
      <div style={{height:'95vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
        <img src='/Cash-n-Guns-Logo.png' style={{width:'40%', height:'auto'}}/>
        <h2 style={{color:'white'}}>Loading...</h2>
        <div className="bar" style={{width:'40vw'}}></div>
      </div>
    )
  }
}

export default LoadingScreen;
