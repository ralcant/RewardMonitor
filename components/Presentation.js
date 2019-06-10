import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight, Image, Dimensions, Animated, Modal, Alert,  TouchableOpacity } from 'react-native';
import {Coin} from "./Coin.js"
// import Draggable from 'react-native-draggable';
import {Choice} from './Choice.js'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';
// import RNRestart from 'react-native-restart';

export class Presentation extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      number_coins: 2,
      modalVisible: false
    }
  }
  componentDidMount() {
    lor(this);
  }

  componentWillUnmount() {
    rol();
  }
  usedCoin = () =>{
    if (this.state.number_coins >=2){
      this.setState({
        number_coins: this.state.number_coins-1
      });
    } else{
      this.setState({modalVisible: true})
      // RNRestart.Restart();
      // console.log("restart?")
    }

  }
  stateChange = (type) => {
    console.log(type)
    if (type === "food" || type === "hug" || type === "medicine") {
      this.props.stateChange(type);
    } else{
      console.log("THIS SHOULDNT HAPPEN")
    }
  }
  render() {
    // console.log("rendered presentation");

    const window = Dimensions.get('window')
    const size = {
      WIDTH: window.width,
      HEIGHT: window.height
    }
    console.log('render_presentation_window', size.WIDTH, size.HEIGHT)
    console.log('render_presentation_wh:', wp(100), hp(100));
    const COINS = {
      coin_1: {
        // bottom: 0,
        // left:0,
        width: hp('20%'),
        height: hp('20%'),
        borderRadius: hp('10%')
      },
      coin_2: {
        // bottom: 0,
        // left:0, 
        // bottom: 0,
        // left: hp('50%'), //555+120
        width: hp('20%'),
        height: hp('20%'),
        borderRadius: hp('10%'), 
      }
  }
  const RADIUS = 9
  const CONSTANTS = { //positions of choices
    food: {
        // bottom: hp('5%'),
        // left: hp('25%'),
        bottom: 0,
        left: wp(50-3.5*RADIUS),
        width: wp(2*RADIUS),
        height: wp(2*RADIUS),
        borderRadius:wp(RADIUS),
    },
    hug: {
        bottom: 0,
        left:wp(50-RADIUS),
        width: wp(2*RADIUS),
        height: wp(2*RADIUS),
        borderRadius:wp(RADIUS),
    },
    medicine:{
        bottom: 0,
        left:wp(50+1.5*RADIUS),
        // bottom: hp('5%'),
        // left: hp('65%'),
        width: wp(2*RADIUS),
        height: wp(2*RADIUS),
        borderRadius:wp(RADIUS)
    }
  } 
  return (
      <View style={styles.container}>
        <View style = {styles.message}> 
          <Text style = {{fontSize: 50}}>Happy: {this.props.values.happy}</Text>
          <Text style = {{fontSize: 50}}>Hungry: {this.props.values.hungry}</Text>
          <Text style = {{fontSize: 50}}>Sick: {this.props.values.sick}</Text>
        </View>
        <View style = {styles.coins}>
          {/* <Draggable  x = {wp(50)} y ={hp(50)} style = {{position:"absolute"}}/>
          <Draggable/> */}
            <Coin usedCoin = {this.usedCoin} stateChange = {this.stateChange} position = {COINS.coin_1} RADIUS ={RADIUS}/>
            <Coin usedCoin = {this.usedCoin} stateChange ={this.stateChange} position = {COINS.coin_2} RADIUS = {RADIUS}/>
          {/* <Coin usedCoin = {this.usedCoin} stateChange = {this.stateChange} position = {COINS.coin_1} RADIUS ={RADIUS}/>
          <Coin usedCoin = {this.usedCoin} stateChange ={this.stateChange} position = {COINS.coin_2} RADIUS = {RADIUS}/> */}
        </View>
        <View style = {styles.choice_container}>
          <Choice image = {require("../assets/watermelon.jpg")} hope = {[CONSTANTS.food, styles.choice]}/>
          <Choice image = {require("../assets/dog_hug.jpg")} hope = {[CONSTANTS.hug, styles.choice]}/>
          <Choice image = { require("../assets/medicine.jpg")} hope = {[CONSTANTS.medicine, styles.choice]}/>

          {/* <Image source = {require("../assets/watermelon.jpg")} style = {[CONSTANTS.food, styles.choice]}/>
          <Image source = {require("../assets/dog_hug.jpg")} style = {[CONSTANTS.hug, styles.choice]}/>
          <Image source = { require("../assets/medicine.jpg")} style = {[CONSTANTS.medicine, styles.choice]}/> in case animatino is not good*/} 
        </View>
      </View>
    );
  }
}

// const {WINDOW_WIDTH, WINDOW_HEIGHT} = Dimensions.get('window');
// console.log(WINDOW_WIDTH, WINDOW_HEIGHT)
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: '#fff',
  },
  choice:{
    borderColor: "steelblue",
    borderWidth: 10,
    position:"absolute",
  },
  choice_container: {
    flex:1,
    flexDirection: "row",
    // justifyContent: "space-around",
    opacity: 0.5,
    // backgroundColor: "steelblue",
  },
  coins:{
    flex: 1,
    flexDirection:"row",
    justifyContent: "space-evenly", 
    // flex: 0, 
    // position: "relative", 
    // top: '50%', 
    // left: '50%'
  },
  message: {
    // textAlign: "center",
    fontWeight: "bold",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});