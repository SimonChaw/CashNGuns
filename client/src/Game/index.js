import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Star, Rect, Image, Text } from 'react-konva';
import LootCard from './LootCard';
import Player from './Player';

class Game extends Component {

  constructor(props){
    super(props)

    this.addAIPlayer = this.addAIPlayer.bind(this)
    this.removeAIPlayer = this.removeAIPlayer.bind(this)
  }

  handleDragStart = e => {
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15
      },
      scaleX: 1.1,
      scaleY: 1.1
    });
  };

  handleDragEnd = e => {
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    });
  };

  addAIPlayer(){
    this.props.gameContainer.addAIPlayer()
  }

  removeAIPlayer(){
    this.props.gameContainer.removeAIPlayer()
  }

  startGame(){

  }

  render(){
    return(
      <Stage width={this.props.width} height={this.props.height}>
        {this.props.gameContainer.gameState === 'pre' ?
          <Layer>
            <Rect
              fill={"yellow"}
              x={200}
              y={200}
              width={200}
              height={100}
              onClick={this.addAIPlayer}
            />
            <Rect
              fill={"blue"}
              x={200}
              y={300}
              width={200}
              height={100}
              onClick={this.removeAIPlayer}
            />
            <Rect
              fill={"green"}
              x={200}
              y={400}
              width={200}
              height={100}
            />
            <Player position={{ x: 0, y: 0 }} spritesheet={this.props.assetManifest.images[4]}/>
            <Player position={{ x: this.props.width - 100, y : 0 }} flip spritesheet={this.props.assetManifest.images[4]}/>
          </Layer>
        :
          null
        }
        {/*<Layer>
        {[...this.props.gameContainer.players].map(player => (
          <Player />
        ))}
        {[...this.props.gameContainer.currentLoot].map(card => (
          <LootCard />
        ))}
        </Layer>*/}
      </Stage>
    )
  }

}

export default Game;
