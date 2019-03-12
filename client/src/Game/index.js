import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Group, Star, Rect, Image, Text } from 'react-konva';
import LootCard from './LootCard';
import ChoiceButton from './ChoiceButton';
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

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
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
        } else {
          this.props.gameContainer.refresh();
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
            <Image
              image={this.props.assetManifest.images[6]}
              ref={node => { this.state.backdrop = node }}
              x={this.props.width / 2.4}
              y={this.props.height / 1.6}
              width={this.props.width/5}
              height={this.props.width/9}
            />
            {[...this.props.gameContainer.players].map((player, i) => (
              <Player sfx={this.props.assetManifest.audio} highlight={this.props.gameContainer.currentStage == 1} handleClick={this.props.gameContainer.currentStage == 1 ? this.props.gameContainer.sendChoice : function(){}} key={i} name={player.name} playerCount={this.props.gameContainer.players.length} flip={i % 2 !== 0} index={i} width={this.props.width} height={this.props.height} spritesheet={this.props.assetManifest.images[4]} />
            ))}
            {[...this.props.gameContainer.currentLoot].map((card, i) => (
              <LootCard key={i} index={i} type={card.type} value={card.value} width={this.props.width} height={this.props.height} cardHandler={this.props.gameContainer.sendChoice} images={this.props.assetManifest.images} />
            ))}
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
              width={this.props.width}
              y={this.props.height / 4}
              fontSize={30}
              fontFamily={"'Anton', sans-serif"}
            />
        </Layer>
        <Layer>
          { this.props.gameContainer.stages[this.props.gameContainer.currentStage] == 'Choice of Bullet Card' &&
            <Group>
              <Text
                fill={'white'}
                text={ this.props.gameContainer.flashMessages.length > 0 ? "" : "Please choose bullet or blank."}
                stroke={'black'}
                strokeWidth={1.5}
                align ={'center'}
                width={this.props.width}
                y={this.props.height / 4}
                fontSize={30}
                fontFamily={"'Anton', sans-serif"}
              />
              <ChoiceButton value={'bullet'} handleClick={this.props.gameContainer.sendChoice} icon={this.props.assetManifest.images[10]} size={this.props.width/5} x={this.props.width / 2 - this.props.width / 3.5} y={this.props.height / 3} badge={true} badgeCount={5} text={'BULLET'} messagesLeft={this.props.gameContainer.flashMessages.length} />
              <ChoiceButton value={'blank'} handleClick={this.props.gameContainer.sendChoice} icon={this.props.assetManifest.images[9]} size={this.props.width/5} x={this.props.width / 2 + this.props.width / 10} y={this.props.height / 3} badge={true} badgeCount={5} text={'BLANK'} messagesLeft={this.props.gameContainer.flashMessages.length} />
            </Group>
          || this.props.gameContainer.stages[this.props.gameContainer.currentStage] == 'Hold Up' &&
            <Group>
              <Text
                fill={'white'}
                text={ this.props.gameContainer.flashMessages.length > 0 ? "" : "Please select a player to target"}
                stroke={'black'}
                strokeWidth={1.5}
                align ={'center'}
                width={this.props.width}
                y={this.props.height / 4}
                fontSize={30}
                fontFamily={"'Anton', sans-serif"}
              />
            </Group>
          || this.props.gameContainer.stages[this.props.gameContainer.currentStage] == 'Courage' &&
            <Group>
              <ChoiceButton value={false} handleClick={this.props.gameContainer.sendChoice} icon={this.props.assetManifest.images[10]} size={this.props.width/5} x={this.props.width / 2 - this.props.width / 3.5} y={this.props.height / 3} text={'BANZAI!'} messagesLeft={this.props.gameContainer.flashMessages.length} />
              <ChoiceButton value={true} handleClick={this.props.gameContainer.sendChoice} icon={this.props.assetManifest.images[9]} size={this.props.width/5} x={this.props.width / 2 + this.props.width / 10} y={this.props.height / 3} text={'COWER'} messagesLeft={this.props.gameContainer.flashMessages.length} />
            </Group>
        }
        </Layer>
        <Layer>
          { this.props.gameContainer.shootOutManifest.length > 0 &&
            <Group>
              <Rect
                width={this.props.width}
                height={this.props.height}
                fill={'darkgrey'}
              />
              <Text
                fill={'white'}
                text={ this.props.gameContainer.shootOutManifest[0].message }
                stroke={'black'}
                strokeWidth={1.5}
                align ={'center'}
                width={this.props.width}
                y={this.props.height / 4}
                fontSize={30}
                fontFamily={"'Anton', sans-serif"}
              />
              <Player nextScene={this.props.gameContainer.nextScene} sfx={this.props.assetManifest.audio} anim={this.props.gameContainer.shootOutManifest[0].bullet ? 'shoot' : 'shoot'} x={this.props.width / 10} highlight={false} key={this.getRandomInt(201, 300)} handleClick={function(){}} name={this.props.gameContainer.players[this.props.gameContainer.shootOutManifest[0].shooter].name} playerCount={this.props.gameContainer.players.length} flip={false} index={0} width={this.props.width} height={this.props.height} spritesheet={this.props.assetManifest.images[4]} />

              <Player sfx={this.props.assetManifest.audio} anim={this.props.gameContainer.getShootOutAnim(false)} x={this.props.width - this.props.width / 10} highlight={false} key={this.getRandomInt(100, 200)} handleClick={function(){}} name={this.props.gameContainer.players[this.props.gameContainer.shootOutManifest[0].target].name} playerCount={this.props.gameContainer.players.length} flip={true} index={1} width={this.props.width} height={this.props.height} spritesheet={this.props.assetManifest.images[4]} />
            </Group>
          }
        </Layer>
      </Stage>
    )
  }

}

export default Game;
