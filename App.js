import React from 'react';
import {Presentation} from "./components/Presentation.js"
import { ScreenOrientation } from 'expo';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
// import {Choices} from './components/Choices.js'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

// import Draggable from 'react-native-draggable'; //another choice for draggable components.

export default class App extends React.Component {
  componentDidMount() { //for changes in orientation
    lor(this);
  }

  componentWillUnmount() { //for changes in orientation
    rol();
  }
  constructor(props) {
    super(props);
    this.state = {
      happy: 50, //best 100
      hungry: 50, //best 0
      sick: 50, //best 0
    }
  }
  stateChange = (type) => { //change state of Jibo
    switch(type){
      case "food": this.setState({hungry: this.state.hungry-1}); break;
      case "hug": this.setState({happy: this.state.happy+1}); break;
      case "medicine": this.setState({sick: this.state.sick-1}); break;
      default: console.log("IT SHOULDNT GET HERE")
    }
  }
  async componentDidMount() { //for it to be in landscape mode
    // console.log("app mounted")
    ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
    // console.log('App:',wp(100), hp(100))
  }
  render() {
    // console.log("rendered App")
    // return <Choices />
    return (
      <View style = {{flex: 1}}>
          <Presentation 
          values = {this.state} 
          style = {styles.container} 
          coins ={2}
          stateChange = {this.stateChange}/>
          {/* <Choices/> */}
      </View>
    )
  }
}
console.log('appsjihsa:', Dimensions.get('window'));
const styles = StyleSheet.create({
  container: {
    fontFamily: 'roboto-light',
    flex : 1,
    flexDirection: "column",
    alignItems: "center",

  }
});
