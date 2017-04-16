import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder
} from 'react-native'

class Deck extends Component {

  constructor(props){
    super(props)

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx , y: gesture.dy })
      },
      onPanResponderRelease: () => {

      }
    })

    this.state = {
      panResponder,
      position
    }
  }

  renderCards = () => {
      const { data, renderCard } = this.props
      return data.map((item, index)=>{
        if(index === 0) {
          return (
            <Animated.View
              key={0}
              style={this.state.position.getLayout()}
              {...this.state.panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          )
        }

        return renderCard(item)
      })
  }

  render(){
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

export default Deck
