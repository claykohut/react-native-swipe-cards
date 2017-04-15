import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'

class Ball extends Component {
  render(){
    return(
      <View style={styles.ball} />
    )
  }
}

const styles = StyleSheet.create({
  ball: {
    backgroundColor: '#000',
    borderRadius: 60,
    width: 30,
    height: 30
  }
})

export default Ball
