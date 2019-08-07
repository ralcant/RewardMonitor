import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight,ImageBackground, Image, Dimensions, Animated, Modal, Alert,  TouchableOpacity } from 'react-native';
import Coin from "./Coin.js"
import Draggable from 'react-native-draggable';
import {Choice} from './Choice.js'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  // listenOrientationChange as lor,
  // removeOrientationListener as rol
} from 'react-native-responsive-screen';
import {floatConversion} from './floatConversion.js'
import { sleep } from './sleep.js';
// import RNRestart from 'react-native-restart';

export class Presentation extends React.PureComponent {
  constructor(props){
    super(props);
    this.client= this.props.client
    this.state = {
      movable: true, //is the coin draggable or not
      
      energy_visible: true, 
      mood_visible: true,
      curiosity_visible: true,

      // modal_shown: false,
      energy_chosen: false,
      mood_chosen: false,
      curiosity_chosen: false,

      // energy_hover: false,
      // mood_hover: false,
      // curiosity_hover: false,

      show_energy_text: true,
      show_mood_text: true,
      show_curiosity_text: true,

    }
    // if (!this.props.is_first){
    //   this.state.energy_visible= true;
    //   this.state.mood_visible= true;
    //   this.state.curiosity_visible = true;
    //   this.state.movable = true;
    // }else{
    //   this.client.send_robot_tts_cmd("<es name=Emoji_Clap nonBlocking='true'/> Excellent Job <pID_name>! <break size='0.5'/> Everytime that you finish an activity you will win a token! You can use this token to help me.".replace("<pID_name>", "Jon"))

    //   this.state.energy_visible= false;
    //   this.state.mood_visible= false;
    //   this.state.curiosity_visible= false;
    //   this.state.movable= false;
    // }



    // this.stateChange = this.stateChange.bind(this);
    this.hideText= this.hideText.bind(this);
    this.send_robot_tts_cmd= this.send_robot_tts_cmd.bind(this)
    this.change_showing_text = this.change_showing_text.bind(this)

    // this.setModalVisible= this.setModalVisible.bind(this)
  }
  async componentDidMount() {
    // lor(this); //for changes in orientation
    this.client = this.props.client     
    if (!this.props.is_first){
      //this setState will make render() show the three coins!
      console.log("setting up...")
      //TODO: make Jibo say one of the Jibo openings
      // await this.client.send_robot_tts_cmd("oh hello")

      // this.setState({
      //   energy_visible: true,
      //   mood_visible: true,
      //   curiosity_visible: true,
      //   movable: true,
      // });
      //TODO: need to change the is_first from the database, is it okayt to change it now?
    } else{
      //This SetState will call render --> componentDidUpdate -->   
      await this.client.send_robot_tts_cmd("<es name=Emoji_Clap nonBlocking='true'/> Excellent Job <pID_name>! <break size='0.5'/> Everytime that you finish an activity you will win a token! You can use this token to help me.".replace("<pID_name>", "Jon"))
      this.setState({
        energy_visible: false,
        mood_visible: false,
        curiosity_visible: false,
        movable: false,
      })
    }
  }
  async componentDidUpdate(){
    let en_visible= this.state.energy_visible;
    let mo_visible = this.state.mood_visible;
    let cu_visible = this.state.curiosity_visible;
    // console.log('States now: (energy, mood, curiosity)',en_visible, mo_visible,cu_visible);
    if (this.props.is_first){
      if (!en_visible && !mo_visible && !cu_visible){
        //make Jibo talk, don't call this.setState until AFTER jibo finished talking  
        console.log("into first if")
        this.setState({
          energy_visible: true
        })
      } 
      if (en_visible && !mo_visible && !cu_visible){
        //make Jibo talk, don't call this.setState until AFTER jibo finished talking
        console.log("into second if!")
        await this.client.send_robot_tts_cmd("If you drag it to the ENERGY bucket, <es name=Emoji_Battery nonBlocking='true'/> my energy will increase. Also, <break size='0.7'/> <es name=excited_05 nonBlocking='true'/>I will be more awake and ready to play with you!"); 
        this.setState({
          mood_visible: true
        })
      }
      if (en_visible && mo_visible && !cu_visible){
        //make Jibo talk, don't call this.setState until AFTER jibo finished talking
        console.log("into third if")
        await this.client.send_robot_tts_cmd("On the other hand, if you drag it to the MOOD bucket, my mood will increase, <es name=excited_05 nonBlocking='true'/> and I will be more happy!") //, callback)
        this.setState({
          curiosity_visible: true
        })
      }
      if (en_visible && mo_visible && cu_visible){
        await this.client.send_robot_tts_cmd("Finally, if you drag the token to the CURIOSITY bucket, I will become more curious. Also, I will <es name=Emoji_Question nonBlocking='true'/>ask many questions, which is important <es name=Emoji_School nonBlocking='true'/>for learning new things!."); 
        this.props.changeFirst()
        this.setState({
          movable: true, //to change it to an animated coin
        })

      }
    }

  }
  // componentWillUnmount() {
  //   rol(); //for changes in orientation
  // }
  // stateChange(type){
  //   console.log(type)
  //   if (type === "energy" || type === "mood" || type === "curiosity") {
  //     this.props.stateChange(type);
  //     let state_chosen = `${type}_chosen`;
  //     this.setState({
  //       [state_chosen]: true,
  //     })
  //   } else{
  //     console.log("THIS SHOULDNT HAPPEN")
  //   }
  // }
  // shouldComponentUpdate(){
  //   console.log(`Chosen, visible, text: ${this.state.curiosity_chosen}, ${this.state.curiosity_visible}, ${this.state.show_curiosity_text}`)
  //   return true
  // }
  hideText(type){
    if (type === "energy" || type === "mood" || type === "curiosity") {
      let text_name = `show_${type}_text`; 
      let state_chosen = `${type}_chosen`;
      // console.log("calling this dunction another time!")
      // this.props.stateChange(type);

      this.setState({
        [text_name]: false, //text underneath won't be shown!
        [state_chosen]: true, // icon will increase size
      }, ()=>{
        this.props.stateChange(type);
        
        this.setState({
          // [text_name]: true, //text underneath won't be shown!        
          [state_chosen]:false,
        })
        // this.props.stateChange(type); 
      })
    } else{
      console.log("THIS SHOULDNT HAPPEN")
    }
  }
  // hoverChoice = (type, visible) =>{
  //   if (visible){
  //     if (!this.state[`${type}_hover`]){
  //       this.setState({
  //         [`${type}_hover`]: visible,
  //       })
  //     }
  //   }else{
  //     if (this.state.energy_hover || this.state.mood_hover || this.state.curiosity_hover){
  //       this.setState({
  //         energy_hover: false,
  //         mood_hover: false,
  //         curiosity_hover: false,
  //       })
  //     }
  //   }
    // }else{
    //   this.setState({
    //     energy_hover: false,
    //     mood_hover: false,
    //     curiosity_hover: false,
    //   })
    // }

  // }
  async send_robot_tts_cmd(type){
    switch(type){
      case "energy": {
        // await this.client.send_robot_tts_cmd("I feel more energetic now! Thank you! I think I'll be awake all night.<es name=eye_happy_out_01/><es name=dance_funny_01/>Just kidding, I also need to sleep.");      
        break;
      }
      case "mood": {
        // await this.client.send_robot_tts_cmd("I feel happier now! Thank you! I think I'm going to dance.<es name=dance_funny_00/> How was my dance? I bet you can do it too! ");      
        break;
      }
      case "curiosity": {
        // await this.client.send_robot_tts_cmd("Now I have even more questions on mind! Why is the sky blue? Why is my name pronounced Jibo and no <phoneme ph='dj iy b o'>Jibo</phoneme>?");      
        break;
      }
      default: console.log("IT SHOULDNT GET HERE")
    }
  }
  restart_chosen =()=>{
    // this.setState({
    //   energy_chosen: false,
    //   mood_chosen: false,
    //   curiosity_chosen: false,
    // })
  }
  change_showing_text(){
    this.setState({
      show_energy_text: true,
      show_mood_text: true,
      show_curiosity_text: true,
    })
  }
  hide_text = (type)=>{
    let text_name = `show_${type}_text`; 

    this.setState({
      [text_name]: false
    })
  }
  render() {

    console.log("Presentation.js is rendering!")
    // console.log(`Energy, Mood and curiosity showing texts: ${this.state.show_energy_text}, ${this.state.show_mood_text}, ${this.state.show_curiosity_text}`);
    //if any modal is visible then the opacity of the background would be low
    let opacity=1// (this.state.energy_modal_shown || this.state.mood_modal_shown || this.state.curiosity_modal_shown) ? 0.1 : 1
    // console.log('render_presentation_wh:', wp(100), hp(100));

  // const COINS = {
  //     coin_1: {
  //       // bottom: 0,
  //       // left:0,
  //       width: hp('20%'),
  //       height: hp('20%'),
  //       borderRadius: hp('10%')
  //     },
  // }
  // const RADIUS = 9
  // const CONSTANTS = { //positions of choices
  //   energy: {
  //       // bottom: hp('5%'),
  //       // left: hp('25%'),
  //       bottom: 0,
  //       left: wp(50-3.5*RADIUS),
  //       width: wp(2*RADIUS),
  //       height: wp(2*RADIUS),
  //       // borderRadius:wp(RADIUS),
  //   },
  //   mood: {
  //       bottom: 0,
  //       left:wp(50-RADIUS),
  //       width: wp(2*RADIUS),
  //       height: wp(2*RADIUS),
  //       // borderRadius:wp(RADIUS),
  //   },
  //   curiosity:{
  //       bottom: 0,
  //       left:wp(50+1.5*RADIUS),
  //       // bottom: hp('5%'),
  //       // left: hp('65%'),
  //       width: wp(2*RADIUS),
  //       height: wp(2*RADIUS),
  //       // borderRadius:wp(RADIUS)
  //   }
  // } 
  //this integer numbers should be integers from 0 to 10. (otherwise there will be no image in assets that matches it)
  let energy_integer_level=  floatConversion(this.props.values.energy); 
  let mood_integer_level= floatConversion(this.props.values.mood);
  let curiosity_integer_level= floatConversion(this.props.values.curiosity);
  return (
        <View style={[{opacity: opacity},styles.container]}>

          <View style = {styles.choice_container}>
            <Choice 
              info={{type: "energy", label: energy_integer_level}}
              // is_hovered = {this.state.energy_hover}
              // setModalVisible={this.setModalVisible} 
              is_chosen= {this.state.energy_chosen} 
              // usedCoin= {this.usedCoin} 
              hope = {[CONSTANTS.energy, styles.choice]} 
              is_visible={this.state.energy_visible}
              show_text={this.state.show_energy_text}
              send_robot_tts_cmd={this.send_robot_tts_cmd}
              restart_chosen={this.restart_chosen}
              change_showing_text={this.change_showing_text}
              />              
              <Choice
              info={{type: "mood", label: mood_integer_level}}
              // is_hovered={this.state.mood_hover}
              // setModalVisible={this.setModalVisible} 
              is_chosen= {this.state.mood_chosen} 
              // usedCoin= {this.usedCoin} 
              hope = {[CONSTANTS.mood, styles.choice]} 
              is_visible={this.state.mood_visible}
              show_text={this.state.show_mood_text}
              send_robot_tts_cmd={this.send_robot_tts_cmd}
              restart_chosen={this.restart_chosen}
              change_showing_text={this.change_showing_text}

              />
              <Choice 
              info={{type: "curiosity", label: curiosity_integer_level}} 
              // is_hovered={this.state.curiosity_hover}
              // setModalVisible={this.setModalVisible} 
              is_chosen= {this.state.curiosity_chosen} 
              // usedCoin= {this.usedCoin} 
              hope = {[CONSTANTS.curiosity, styles.choice]} 
              is_visible={this.state.curiosity_visible}
              show_text={this.state.show_curiosity_text}
              send_robot_tts_cmd={this.send_robot_tts_cmd}
              restart_chosen={this.restart_chosen}
              change_showing_text={this.change_showing_text}
              hide_text ={this.hide_text}
              />
          </View>
          <Coin 
            setModalVisible={this.setModalVisible} 
            stateChange = {this.stateChange} 
            position = {COINS.coin_1} 
            RADIUS ={RADIUS}
            hoverChoice = {this.hoverChoice}
            hideText={this.hideText}
            movable={this.state.movable}
          />
        </View>
    );
  }
}

// console.log(`DIMENSIONS HERE (WIDTH, HEIGHT) = ${wp(100)}, ${hp(100)}`)
// const window = Dimensions.get('window')
// const size = {
//   WIDTH: window.width,
//   HEIGHT: window.height
// }
// console.log(`DIMENSIONS HEREEEEEE TOOOO: (WIDTH, HEIGHT)= ${size.WIDTH}, ${size.HEIGHT}`)
let deviceH = Dimensions.get('screen').height; //height considering the soft menu bar (Dimensions.get('window').height does not consider it)
// console.log(`Device total height is ${deviceH}`)

const RADIUS = 12
const COIN_RADIUS = wp(3/4*RADIUS)

const COIN_SPACE = deviceH-wp(17*RADIUS/6)
const TOP_COIN= COIN_SPACE/2-COIN_RADIUS;
const COINS = StyleSheet.create({
  coin_1: {
    top: TOP_COIN,
    left: wp(50)-COIN_RADIUS,
    width: 2*COIN_RADIUS,
    height: 2*COIN_RADIUS,
  },
});
const CONSTANTS = StyleSheet.create({ //positions and sizes of choices
  energy: {
      bottom: wp(5*RADIUS/6), //because the text also has a height of wp(5*RADIUS/6)
      left: wp(50-3.5*RADIUS),
      width: wp(2*RADIUS),
      height: wp(2*RADIUS),
  },
  mood: {
      bottom: wp(5*RADIUS/6),
      left:wp(50-RADIUS),
      width: wp(2*RADIUS),
      height: wp(2*RADIUS),
  },
  curiosity:{
      bottom: wp(5*RADIUS/6),
      left:wp(50+1.5*RADIUS),
      width: wp(2*RADIUS),
      height: wp(2*RADIUS),
  }
});

const styles = StyleSheet.create({
  container: {
    // width: wp(100),
    // height: hp(100),
    flex:1, //includes soft menu bar
    // borderColor: "red",
    // borderWidth: 10, //USE IT WHEN YOU WANT TO SEE WHAT IS THE BORDER (NOT STETIC)
  },
  choice_container: {
    flex:1,
    flexDirection: "row",
    // position: "absolute",
    // top: 0,
    // bottom: 0,
    // left: 0,
    // right: 0,
    // borderColor: "green",
    // borderWidth: 10, //USE IT WHEN YOU WANT TO SEE WHAT IS THE BORDER (NOT STETIC)
    // justifyContent: "space-around",
    // opacity: 1,
    // backgroundColor: "steelblue",
  },
  choice:{
    // borderColor: "steelblue",
    // borderWidth: 10, //USE IT WHEN YOU WANT TO SEE WHAT IS THE BORDER (NOT STETIC)
    position:"absolute",
    // position: "relative",
  },

  coins:{
    // flex: 1,
    // flexDirection:"row",
    // justifyContent: "space-evenly", 
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