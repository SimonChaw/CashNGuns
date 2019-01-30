import React, { Component } from 'react';
import Konva from 'konva';
import { Image, Text, Group } from 'react-konva';

let animator;
let index = 0;
class Player extends Component {

  constructor(props){
    super(props)

    this.state = {
      taken : false,
      currentAnimation : 'default',
      name : '',
      wounds : 0,
      currentCash : 0,
      sprite : undefined
    }

  }

  componentDidMount(){
    this.props.spritesheet.onload = () => {
      this.state.sprite.crop({
        x: 0,
        y: 0,
        width: 630,
        height: 700
      });
      this.state.sprite.blue(200);
      this.state.sprite.getLayer().batchDraw()
      animator = new Animator(this.state.sprite)
      animator.play();
    }


  }

  switchAnim(){
    index = index === animator.animNames.length - 1 ? 0 : index + 1;
    animator.switchAnim(index);
  }

  render(){
    return(
      <Group>
        <Image
          image={this.props.spritesheet}
          ref={node => { this.state.sprite = node }}
          x={0}
          y={0}
          x={this.props.position.x}
          y={this.props.position.y}
          scaleX={0.035}
          scaleY={0.5}
          draggable
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.6}
          blue={200}
          onClick={this.switchAnim}
        />
        <Text
          fill={'white'}
          text={'YOU'}
          ref={node => { this.textNode = node }}
          x={420}
          y={250}
          fontSize={30}
          fontFamily={"'Anton', sans-serif"}
        />
      </Group>
  )}

}

class Animator {

  constructor(imageNode){
    this.tickCount = 0
    this.frameIndex = 0
    this.ticksPerFrame = 10
    this.currentAnimation = 'idle'
    this.imageNode = imageNode
    this.anim = new Konva.Animation(function(frame){
      animator.update(frame);
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
            height: 700
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
        'loop' : true,
      }
    }
    this.animNames = Object.keys(this.animations);
  }

  play(){
    this.anim.start();
  }

  switchAnim(anim){
    this.anim.stop();
    this.currentAnimation = this.animNames[anim];
    this.frameIndex = 0;
    this.play();
  }

  update(frame){
    animator.tickCount ++;
    if (animator.tickCount > 8) {
      animator.tickCount = 0;
      if (animator.frameIndex === animator.animations[animator.currentAnimation].frames.length - 1) {
        if (! animator.animations[animator.currentAnimation].loop) {
          animator.frameIndex = animator.animations[animator.currentAnimation].endFrame;
          animator.anim.stop();
        } else {
          animator.frameIndex = 0;
        }
      } else {
        animator.frameIndex ++;
      }
      animator.imageNode.crop(animator.animations[animator.currentAnimation].frames[animator.frameIndex]);
      animator.imageNode.getLayer().batchDraw()
    }
  }

}

export default Player;
