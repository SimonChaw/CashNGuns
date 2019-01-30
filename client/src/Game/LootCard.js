import React, { Component } from 'react';
import Konva from 'konva';
import { Image, Text, Group } from 'react-konva';

class LootCard extends Component {

  constructor(props){
    super(props)

    this.state = {
      taken : false,
      index : 0,
      type : undefined,
      value : 5000,
    }

    this.handleClick = this.handleClick.bind(this)
  }

  componentDidMount(){
    this.props.image.onload = () => {
      this.imageNode.getLayer().batchDraw()
    }
  }

  handleClick(e){
    var canPick = Math.round(Math.random() * 1);
    console.log(canPick);
    if (canPick === 1) {
      e.target.to({
        opacity : 0,
        scaleX : 2,
        scaleY : 2
      })
      this.textNode.setAttrs({
        opacity : 100
      })
      this.textNode.to({
        opacity : 0,
        scaleX : 5,
        scaleY : 5
      })
    } else {
      console.log('cannot pick');
    }
  }

  handleMouseEnter(e){
    console.log('hit');
    e.target.setAttrs({
      shadowOffset: {
        x: 15,
        y: 15
      },
      scaleX: 1.1,
      scaleY: 1.1
    })
    e.target.getLayer().batchDraw()
  }

  handleMouseLeave(e){
    e.target.to({
      duration: 0.5,
      easing: Konva.Easings.ElasticEaseOut,
      scaleX: 1,
      scaleY: 1,
      shadowOffsetX: 5,
      shadowOffsetY: 5
    });
  }

  render(){
    return(
      <Group>
        <Image
          image={this.props.image}
          ref={node => { this.imageNode = node }}
          width={100}
          height={50}
          x={100}
          y={100}
          draggable
          rotation={340}
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.6}
          onClick={this.handleClick}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        />
        <Text
          fill={'green'}
          text={'+$' + this.state.value}
          ref={node => { this.textNode = node }}
          x={120}
          y={30}
          opacity={0}
          fontSize={24}
          fontFamily={"'Anton', sans-serif"}
        />
      </Group>
  )}

}

export default LootCard;
