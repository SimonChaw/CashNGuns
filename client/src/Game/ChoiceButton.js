import React, { Component } from 'react';
import Konva from 'konva';
import { Image, Text, Group, Rect } from 'react-konva';

class ChoiceButton extends Component {

  constructor(props){
    super(props)

    this.state = {
      textNode : undefined,
      icon : undefined
    }
  }

  componentDidUpdate(){
    if (this.state.textNode) {
      this.state.textNode.x(this.props.x + this.props.size / 2 - this.state.textNode.textWidth / 2)
    }
  }

  render(){
    return(
      <Group onClick={() => this.props.handleClick(this.props.value)}>
      { this.props.messagesLeft < 1 &&
        <Group>
          <Rect
            fill={"white"}
            x={this.props.x}
            y={this.props.y}
            width={this.props.size}
            height={this.props.size}
            shadowEnabled={true}
            shadowOpacity={0.6}
            shadowBlur={2}
            shadowOffsetX={10}
            shadowOffsetY={10}
          />
          <Rect
            fill={"white"}
            stroke={"blue"}
            strokeWidth={this.props.size * 0.05}
            x={this.props.x + this.props.size * 0.05}
            y={this.props.y + this.props.size * 0.05}
            width={this.props.size * 0.9}
            height={this.props.size * 0.9}
          />
          <Text
            ref ={ node => this.state.textNode = node}
            text={this.props.text}
            fill={"blue"}
            stroke={"blue"}
            strokeWidth={this.props.size * 0.005}
            fontSize={this.props.size / 10}
            x={0}
            y={this.props.y + this.props.size / 1.2}
          />
        </Group>
      }
      </Group>
    )
  }

}

export default ChoiceButton;
