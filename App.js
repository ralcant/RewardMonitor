// /// <reference path="./node_modules/jibo/typings/index.d.ts" />
import React from 'react';
import {Presentation} from "./components/Presentation.js"
import { ScreenOrientation } from 'expo';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
// import {Choices} from './components/Choices.js'
// import {
//   widthPercentageToDP as wp,
//   heightPercentageToDP as hp,
//   listenOrientationChange as lor,
//   removeOrientationListener as rol
// } from 'react-native-responsive-screen';
import {RosClient} from './RosClient.js';
import RNExitApp from 'react-native-exit-app';


//IN CASE "expo start" does not connect with the correct IP address of the computer
// export env REACT_NATIVE_PACKAGER_HOSTNAME=192.168.41.89


// import Draggable from 'react-native-draggable'; //another choice for draggable components.

// let ROSLIB = require('roslib');

export default class App extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //TODO: RETRIEVE VALUES FROM THE DATABASE
      energy: 1, //has to be from 0 to 10
      mood: 6, //has to be from 0 to 10
      curiosity: 9, // has to be from 0 to 10
      // energy_modal: false,
      // mood_modal: false,
      // curiosity_modal: false,
      is_first: false, //is this the first interaction with Jibo 
      is_playing: null,
    }
    this.changeFirst= this.changeFirst.bind(this);
    /*Necessary here because we are passing this.client in Presentation.js*/ 
    this.client = new RosClient()
    this.client.setupRosbridgeClient();
    this.client.setupPublisher();
    this.client.setupStateSubscriber();
    // console.log(typeof(this.client))
  }
  componentDidMount() { //for changes in orientation
    // lor(this);
    // ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);

    //Insert code to make Jibo Say Something
    // console.log(ROSLIB)
    // jibo.tts.speak('connection confirmed'); //USED FOR MAKING JIBO SPEAK, can I play any TTS here? (animations)
    // this.client.setupRosbridgeClient();
    // this.client.setupPublisher();
    // this.client.send_robot_tts_cmd("<es name=excited_01 nonBlocking='true'/>Connected to the app!");
    // this.client = new RosClient()
    // this.client.setupRosbridgeClient();
    // this.client.setupPublisher();
    // this.client.setupStateSubscriber();
    // this.setState
  }
  componentWillUnmount() { //for changes in orientation
    // rol();
    this.client.send_robot_tts_cmd("<es name=excited_01 nonBlocking='true'/>See you next time!<break size='1.0'/>"); // hasn't worked so far :(
    
  }
  closeApp =() =>{
    this.client.close(); //for disconnecting the client just created
    delete this.client //deleting the client. Necessary? Used it correctly?
    // RNExitApp.exitApp(); //for exiting the app
  }
  stateChange = (type) => { //change state of Jibo
    switch(type){
      case "energy": {
        this.setState({
          energy: this.state.energy+1,
          // energy_visible: true,
        });
        // this.client.send_rinitiaaobot_tts_cmd("<es name=excited_01 nonBlocking='true'/>Token dragged to the Energy bucket");      
        break;
      }
      case "mood": {
        this.setState({
          mood: this.state.mood+1,
          // mood_modal: true,
        });
        // this.client.send_robot_tts_cmd("<es name=excited_01 nonBlocking='true'/>Token dragged to the Mood bucket");      
        break;
      }
      case "curiosity": {
        this.setState({
          curiosity: this.state.curiosity+1,
          // curiosity_modal: true,
        });
        // this.client.send_robot_tts_cmd("<es name=excited_01 nonBlocking='true'/>Token dragged to the Curiosity bucket");      
        break;
      }
      default: console.log("IT SHOULDNT GET HERE")
    }
    // this.closeApp(); //TODO: show a message (maybe a modal) that shows that the App is being closed
  }
  // async componentDidMount() { //for it to be in landscape mode
  //   // console.log("app mounted")
  //   ScreenOrientation.allowAsync(ScreenOrientation.Orientation.ALL);
  //   // console.log('App:',wp(100), hp(100))
  // }
  changeFirst(){
    //TODO: CHANGE IT FROM THE DATABASE!
    this.setState({
      is_first: false,
    })
  }
  render() {
    console.log("rendered App")
    //asssumes only one modal will be visibl
    // modal_shown = this.state.energy_modal || this.state.mood_modal || this.state.curiosity_modal
    return (
      <View style = {{backgroundColor: '#FF6865',flex:1,} }>
          <Presentation
          // modal_shown= {modal_shown
          values = {this.state} 
          // style = {styles.container} 
          // coins ={1}
          changeFirst= {this.changeFirst}
          stateChange = {this.stateChange}
          is_first= {this.state.is_first}
          client = {this.client}
          />
          {/* <Choices/> */}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    fontFamily: 'roboto-light',
    flex : 1,
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#FF6865",
  }
});
