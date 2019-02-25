import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Star, Rect, Image, Text } from 'react-konva';
import LootCard from './LootCard';
import Player from './Player';

class Game extends Component {

  constructor(props){
    super(props)
    this.state = {
      backdrop : undefined,
      flashMessage : undefined,
    }
    this.addAIPlayer = this.addAIPlayer.bind(this)
    this.removeAIPlayer = this.removeAIPlayer.bind(this)
    this.startGame = this.startGame.bind(this)
    this.handleFlash = this.handleFlash.bind(this)
  }

  componentDidMount(){
    this.state.backdrop.getLayer().batchDraw()
  }

  componentDidUpdate(oldProps) {
    if (this.props.gameContainer.flashMessages.length > 0 && this.state.flashMessage.text() === "") {
      this.handleFlash();
    }
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
    this.props.gameContainer.sendAction('add ai player')
  }

  removeAIPlayer(){
    this.props.gameContainer.sendAction('remove ai player')
  }

  startGame(){
    this.props.gameContainer.sendAction('start game')
  }

  handleFlash(){
    // Check if this is the first message to come through.
    if (this.state.flashMessage.text() === "") {
      this.state.flashMessage.text(this.props.gameContainer.flashMessages[0])
    }
    // Reset Animations if Needed
    this.state.flashMessage.scaleX(1)
    this.state.flashMessage.scaleY(1)
    this.state.flashMessage.opacity(1)

    // Run Next Anim.
    this.state.flashMessage.to({
      duration: 3,
      easing: Konva.Easings.BackEaseIn,
      scaleX: 1.5,
      scaleY: 1.5,
      opacity: 0
    });
    // Set timeout, wait for animation to end
    setTimeout((
      function(){
        // Shift to next message.
        this.props.gameContainer.flashMessages.shift()
        // Does the next message exist? If not set text as ""
        this.state.flashMessage.text(this.props.gameContainer.flashMessages[0] == undefined ? "" : this.props.gameContainer.flashMessages[0] )
        this.state.flashMessage.getLayer().batchDraw()
        // Are there more messages in the stack? If so, "loop".
        if (this.props.gameContainer.flashMessages.length > 0) {
          this.handleFlash();
        }
      }.bind(this)),
   3000);
  }


  render(){
    return(
      <Stage width={this.props.width} height={this.props.height}>
        {this.props.gameContainer.gameState === 'pre' ?
          <Layer>
            <Image
              image={this.props.assetManifest.images[5]}
              x={0}
              y={0}
              height={this.props.height}
              width={this.props.width}
            />
            <Image
              image={this.props.assetManifest.images[7]}
              x={this.props.width / 2.4}
              y={this.props.height - this.props.width/5}
              width={this.props.width/5}
              height={this.props.width/5}
            />
            <Rect
              fill={"yellow"}
              x={0}
              y={0}
              width={200}
              height={100}
              onClick={this.addAIPlayer}
            />
            <Rect
              fill={"blue"}
              x={0}
              y={100}
              width={200}
              height={100}
              onClick={this.removeAIPlayer}
            />
            <Rect
              fill={"green"}
              x={0}
              y={200}
              width={200}
              height={100}
              onClick={this.startGame}
            />
            {[...this.props.gameContainer.players].map((player, i) => (
              <Player key={i} name={player.name} playerCount={this.props.gameContainer.players.length} flip={i % 2 !== 0} index={i} width={this.props.width} height={this.props.height} spritesheet={this.props.assetManifest.images[4]} />
            ))}
            <Image
              image={this.props.assetManifest.images[6]}
              ref={node => { this.state.backdrop = node }}
              x={this.props.width / 2.4}
              y={this.props.height / 1.6}
              width={this.props.width/5}
              height={this.props.width/9}
            />
          </Layer>
        :
          null
        }
        <Layer>
            <Text
              fill={'white'}
              text={""}
              stroke={'black'}
              strokeWidth={1.5}
              ref={ node => { this.state.flashMessage = node }}
              align ={'center'}
              y={this.props.height / 20}
              fontSize={30}
              fontFamily={"'Anton', sans-serif"}
            />
        </Layer>
      </Stage>
    )
  }

}

export default Game;
