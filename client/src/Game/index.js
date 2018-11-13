import React, { Component } from 'react';
import Konva from 'konva';
import { Stage, Layer, Star, Rect, Image, Text } from 'react-konva';

class Game extends Component {
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

  componentDidMount(){
    this.props.requestRefresh()
  }

  render(){
    return(
      <Stage width={this.props.width} height={this.props.height}>
        <Layer>
          <Image
            image={this.props.assetManifest.images[1]}
            />
        </Layer>
      </Stage>
    )
  }

}

export default Game;
