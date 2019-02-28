import React, { Component } from 'react';
import Konva from 'konva';
import { Image, Text, Group, Rect } from 'react-konva';

class ChoiceButton extends Component {

  constructor(props){
    super(props)

    this.state = {
      textNode : undefined,
    }
  }


  render(){
    return(
      <Group>
      { this.props.messagesLeft < 1 &&
        <Group>
          <Rect
            fill={"white"}
            x={this.props.x}
            y={this.props.y}
            width={this.props.size}
            height={this.props.size}
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
            fontSize={this.props.size / 10}
            x={this.state.textNode ? this.props.x + this.props.size / 2 - this.state.textNode.textWidth : 0}
            y={this.state.textNode ? this.props.y + this.props.size : 0}
          />
        </Group>
      }
      </Group>
    )
  }

}

export default ChoiceButton;
