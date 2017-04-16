import React, { Component } from 'react'
import { View, Animated } from 'react-native'

class Deck extends Component {

  renderCards = () => {
      const { data, renderCard } = this.props
      return data.map((item)=>{
        console.log('mapping over item.. ', item)
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
