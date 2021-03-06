import React, { Component } from 'react'
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager
} from 'react-native'

const SCREEN_WIDTH = Dimensions.get('window').width
const SWIPE_THRESHOLD = SCREEN_WIDTH * .3
const SWIPE_OUT_DURATION = 400

class Deck extends Component {

  static defaultProps = {
    onSwipeLeft: () => {},
    onSwipeRight: () => {}
  }

  constructor(props){
    super(props)

    const position = new Animated.ValueXY();

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gesture) => {
        position.setValue({ x: gesture.dx , y: gesture.dy })
      },
      onPanResponderRelease: (event, gesture) => {
        if( gesture.dx > SWIPE_THRESHOLD ){
          this.forceSwipe('right')
        } else if( gesture.dx < -SWIPE_THRESHOLD ){
          this.forceSwipe('left')
        } else {
          this.resetPosition()
        }

      }
    })

    this.state = {
      panResponder,
      position,
      activeIndex: 0
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.data !== this.props.data){
      this.setState({activeIndex: 0})
    }
  }

  componentWillUpdate(nextProps) {
    if(nextProps.data === this.props.data){
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true); // for android
      LayoutAnimation.spring();
    }
  }

  forceSwipe = (direction) => {
    const x = direction === 'right' ? SCREEN_WIDTH * 1.5 : -(SCREEN_WIDTH*1.5)
    Animated.timing(this.state.position, {
      toValue: { x, y: 0 },
      duration: SWIPE_OUT_DURATION
    }).start(()=> this.onSwipeComplete(direction))
  }

  onSwipeComplete = (direction) => {
    const { onSwipeLeft, onSwipeRight, data } = this.props
    const item = data[this.state.index]

    direction == 'left' ? onSwipeLeft(item) : onSwipeRight(item)

    this.state.position.setValue({ x: 0, y: 0 })
    this.setState({activeIndex: this.state.activeIndex + 1 });
  }

  resetPosition = () => {
    Animated.spring(this.state.position, {
      toValue: { x: 0, y: 0 }
    }).start()
  }

  getCardStyle = () => {
    const { position } = this.state
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH*2.0, 0, SCREEN_WIDTH*2.0],
      outputRange: ['-120deg', '0deg', '120deg']
    })

    return {
      ...position.getLayout(),
      transform: [{ rotate }]
    }
  }

  renderCards = () => {
      const { data, renderCard, renderNoMoreCards } = this.props
      const { activeIndex } = this.state

      if(activeIndex >= data.length){
        return renderNoMoreCards()
      }

      return data.map((item, index)=>{
        if(index < activeIndex){ return null; }

        if(index === activeIndex) {
          return (
            <Animated.View
              key={item.id}
              style={[this.getCardStyle(), styles.cardStyle]}
              {...this.state.panResponder.panHandlers}
            >
              {renderCard(item)}
            </Animated.View>
          )
        }

        return (
          <Animated.View
            key={item.id}
            style={[styles.cardStyle, { top: 10 * (index - activeIndex)}]}>
            {renderCard(item)}
          </Animated.View>
        )
      }).reverse()
  }

  render(){
    return (
      <View>
        {this.renderCards()}
      </View>
    )
  }
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH
  }
}

export default Deck
