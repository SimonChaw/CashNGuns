import React, { Component } from 'react';
import Konva from 'konva';
import { Image, Text, Group } from 'react-konva';

class Player extends Component {

  constructor(props){
    super(props)

    this.state = {
      name : '',
      wounds : 0,
      currentCash : 0,
      sprite : undefined,
      index : 0,
      text : undefined
    }
    this.switchAnim = this.switchAnim.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.setupAnimator = this.setupAnimator.bind(this);
  }

  componentDidMount(){
    this.setupAnimator();
  }

  setupAnimator(){
    this.state.sprite.crop({
      x: 0,
      y: 0,
      width: 630,
      height: 700
    });
    let animator = new Animator(this.state.sprite, this.props.width, this.props.sfx)
    animator.play();
    if (this.props.anim) {
      animator.switchAnim(this.props.anim)
      // This Player object was created during the shoot out loop. We have a next scene function to use
      if (this.props.nextScene) {
        setTimeout((
          function(){
            this.props.nextScene()
          }.bind(this)),3000)
      }
    }
    this.setState({
      'animator' : animator
    })
    this.state.sprite.getLayer().batchDraw()
  }

  componentWillUnmount(){
    this.state.animator.stop();
    delete this.state.animator;
  }

  switchAnim(){
    let index = this.state.index;
    index = index === this.state.animator.animNames.length - 1 ? 0 : index + 1;
    this.state.animator.switchAnim(index);
    this.setState({
      'index' : index
    })
  }

  handleMouseEnter(){
    if (this.props.highlight) {
      this.state.text.fill('red')
    }
  }

  handleMouseLeave(){
    if (this.props.highlight) {
      this.state.text.fill('white')
    }
  }

  render(){
    return(
      <Group>
        <Image
          onClick={() => this.props.handleClick(this.props.index)}
          image={this.props.spritesheet}
          ref={node => { this.state.sprite = node }}
          x={this.props.x ? this.props.x : this.props.index % 2 === 0 ? this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 1.3) : this.props.width - this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 1.3)}
          y={this.props.x ? this.props.height / 2 : -1.6 * (this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 4)) + this.props.height}
          scaleX={this.props.flip ? -0.035 * (1 - 0.075 * (5 - (this.props.index - this.props.index % 2) / 2)) : 0.035 * (1 - 0.075 * (5 - (this.props.index - this.props.index % 2) / 2))}
          scaleY={0.5 * (1 - 0.075 * (5 - (this.props.index - this.props.index % 2) / 2))}
          draggable
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.6}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <Text
          ref={node => { this.state.text = node }}
          fill={'white'}
          text={this.props.name}
          stroke={'black'}
          strokeWidth={1.5}
          x={this.props.x ? this.props.x - (this.props.flip ? this.props.width / 10 : 0) : this.props.index % 2 === 0 ? this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 1.3) + this.props.width / 40 : this.props.width - this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 1.3) - this.props.width / 10}
          y={this.props.x ? this.props.height / 2 : -1.6 * (this.props.width * 0.045 * (5 - (this.props.index - this.props.index % 2) / 4)) + this.props.height}
          fontSize={30}
          fontFamily={"'Anton', sans-serif"}
        />
      </Group>
  )}

}

class Animator {

  constructor(imageNode, canvasWidth, sfx){
    let me = this
    this.tickCount = 0
    this.frameIndex = 0
    this.ticksPerFrame = 10
    this.currentAnimation = 'idle'
    this.imageNode = imageNode
    this.anim = new Konva.Animation(function(frame){
      me.update(frame);
    })

    this.animations = {
      'idle' : {
        'frames' : [
          {
            x: 0,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630,
            y: 0,
            width: 630,
            height: 700
          }
        ],
        'loop' : true
      },
      'shoot' : {
        'frames' : [
          {
            x: 630 * 2,
            y: 0,
            width: 630,
            height: 700,
            sfx : sfx[1]
          },
          {
            x: 630 * 3,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 4,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 5,
            y: 0,
            width: 630,
            height: 700
          },
        ],
        'loop' : false,
        'endFrame' : 0
      },
      'die' : {
        'frames' : [
          {
            x: 630 * 6,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 7,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 8,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 9,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 10,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 11,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 12,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 13,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 14,
            y: 0,
            width: 630,
            height: 700
          },
        ],
        'loop' : false,
        'endFrame' : 8
      },
      'hurt' : {
        'frames' : [
          {
            x: 630 * 6,
            y: 0,
            width: 630,
            height: 700
          },
          {
            x: 630 * 7,
            y: 0,
            width: 630,
            height: 700
          }
        ],
        'loop' : false,
      },
      'runaway' : {
        'frames' : [
        {
          x: 0,
          y: 0,
          width: 630,
          height: 700
        }
      ],
        'loop' : true,
        'special' : () => {
          this.imageNode.to({
            duration : 2,
            x : (canvasWidth + 100)
          })
        }
      }
    }
    this.animNames = Object.keys(this.animations);
  }



  play(){
    this.anim.start();
    if (this.animations[this.currentAnimation].special) {
      this.animations[this.currentAnimation].special();
    }
  }

  stop(){
    this.anim.stop();
  }

  switchAnim(anim){
    this.anim.stop();
    this.currentAnimation = typeof anim === "string" ? anim : this.animNames[anim];
    this.frameIndex = 0;
    this.play();
  }

  update(frame){
    this.tickCount ++;
    if (this.tickCount < 2) {
      if (this.animations[this.currentAnimation].frames[this.frameIndex].sfx) {
        /*
        let playPromise = this.animations[this.currentAnimation].frames[this.frameIndex].sfx.play()
        if (playPromise !== undefined) {
          playPromise.then(_ => {
            // Automatic playback started!
            // Show playing UI.
            this.animations[this.currentAnimation].frames[this.frameIndex].sfx.pause()
          })
          .catch(error => {
            // Auto-play was prevented
            // Show paused UI.
          });
        }
        */
      }
    }
    if (this.tickCount > 8) {
      this.tickCount = 0;
      if (this.frameIndex === this.animations[this.currentAnimation].frames.length - 1) {
        if (! this.animations[this.currentAnimation].loop) {
          this.frameIndex = this.animations[this.currentAnimation].endFrame;
          this.anim.stop();
        } else {
          this.frameIndex = 0;
        }
      } else {
        this.frameIndex ++;
      }
      this.imageNode.crop(this.animations[this.currentAnimation].frames[this.frameIndex]);
      this.imageNode.getLayer().batchDraw()
    }
  }

}

export default Player;
