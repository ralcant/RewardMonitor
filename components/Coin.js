import React, {Component} from 'react'
import { ScreenOrientation } from 'expo';
import { StyleSheet, Text, View,Image, Animated, PanResponder, Dimensions, Easing} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    // listenOrientationChange as lor,
    // removeOrientationListener as rol
  } from 'react-native-responsive-screen';
// import RNRestart from 'react-native-restart';


export default class Coin extends Component{
    constructor(props){
        super(props);
        this.state = {
            // pan: new Animated.ValueXY(), //pan is a vector
            // opacity: 1,//new Animated.Value(1), // for opacity
            showDraggable: true,
            // touched: false,
            movable: true,
            current_hover: null,
        };
        this.pan = new Animated.ValueXY()

        //for allowing it to be draggable
            // Add a listener for the delta value change
        this._val = { x:0, y:0 }
        this.pan.addListener((value) => this._val = value);
        
        
        this.panResponder = PanResponder.create({
            // onMoveShouldSetPanResponderCapture: () => true,
            onStartShouldSetPanResponder: (e, gesture)=> true,
            // onMoveShouldSetPanResponderCapture: () => true,
            // onStartShouldSetPanResponder: (evt, gestureState) => true,
            // onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            // onMoveShouldSetPanResponder: (evt, gestureState) => true,
            // onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.pan.setOffset({
                    x: this._val.x,
                    y: this._val.y
                });
                this.pan.setValue({x: 0, y: 0});
                // this.state.touched= true;
                // this.setState({
                //     touched: true,
                // })
            },
            onPanResponderMove: (e, gesture) =>{
                Animated.event([null, {dx: this.pan.x, dy: this.pan.y}])(e, gesture)
                /*how much has the position changed since
                begining of the tap*/

                // let result = this.general_collision(gesture); 

                // if (result){
                //     console.log(`it's hovering around ${result}!`)
                //     // this.props.hoverChoice(result, true)
                // } 
                // else{
                //     // this.props.hoverChoice(result, false)
                // }
            },
            onPanResponderRelease: (e, gesture) => {
                // console.log('xd',this.state.pan.getLayout())
                // this.state.pan.flattenOffset();
                const result = this.general_collision(gesture);
                if (result){
                    this.setState({
                        showDraggable: false,
                    })
                    // Animated.timing(this.state.opacity, {
                    //     toValue: 0,
                    //     duration: 1000
                    // }).start()
                    this.props.hideText(result);
                    // this.props.stateChange(result);
                    
                    // this.props.usedCoin();
                        // RNRestart.Restart();
                } else{ //coming back to initial state
                    // this.state.touched= false
                    // this.setState({
                    //     touched: false,
                    // })
                    Animated.timing(this.pan, { 
                        toValue: { x:0, y:0 },
                        duration: 500,
                        easing: Easing.linear,
                    }).start()
                // Animated.spring(this.state.pan, {
                //     toValue: { x: 0, y: 0 },
                //     friction: 5
                //   }).start();    
           
                }
            }
        });
    }
    // componentDidMount() {
    //     lor(this);
    // }
    
    // componentWillUnmount() {
    //     rol();
    // }
    // componentWillMount() {
    //     //THIS NEEDS THE CURRENT REACT VERSION (16.5) --> componentWillMount()
    //     //is deprecated for new versions (17 and beyond)
    //     this.panResponder = PanResponder.create({
    //         onMoveShouldSetResponderCapture: () => true,
    //         onMoveShouldSetPanResponderCapture: () => true,
    //         onPanResponderGrant: (evt, gestureState) => {
    //             this.setState({
    //                 touched: true,
    //             })
    //             this.state.pan.setOffset({
    //                 x: this.state.pan.x._value,
    //                 y: this.state.pan.y._value
    //             });
    //             this.state.pan.setValue({x: 0, y: 0});
    //             // this.state.touched= true;

    //         },
    //         onPanResponderMove: Animated.event([
    //                 null,
    //                 {dx: this.state.pan.x, dy: this.state.pan.y}, /*how much has the position changed since
    //                                                                 begining of the tap*/
    //         ]),
    //         onPanResponderRelease: (evt, gestureState) => {
    //             // console.log('xd',this.state.pan.getLayout())
    //             this.state.pan.flattenOffset();
    //             const result = this.general_collision(gestureState); 
    //             if (result){
    //                 Animated.timing(this.state.opacity, {
    //                     toValue: 0,
    //                     duration: 2000
    //                 }).start(() => { //Once opacity = 0, the draggable will not be shown anymore
    //                     this.setState({
    //                     showDraggable: false
    //                     })
    //                 })
    //                 this.props.stateChange(result);
    //                 // this.props.usedCoin();
    //                     // RNRestart.Restart();
    //             } else{ //coming back to initial state
    //                 this.setState({touched: false})

    //                 Animated.timing(this.state.pan, { 
    //                     toValue: { x:0, y:0 },
    //                     duration: 500,
    //                     easing: Easing.linear,
    //                 }).start()
    //             // Animated.spring(this.state.pan, {
    //             //     toValue: { x: 0, y: 0 },
    //             //     friction: 5
    //             //   }).start();    
           
    //             }
    //         }
    //     });

    // }
    
    general_collision(gesture) {
        // console.log('collision:', wp(100), hp(100))
        const R = this.props.RADIUS
        // console.log(R)
        /*
         HAS TO BE SYNCHRONIZED WITH "CONSTANTS" from ./Presentation.js
         Note: position (0,0) is on the top left corner, and the direction of X and Y positive coordinates is:
            - - -s
            .
            .
            u
        */
        const x_energy = wp(50-2.5*R) //CONSTANTS.energy.left+ R
        const x_mood = wp(50) //CONSTANTS.mood.left+ R
        const x_curiosity = wp(50+2.5*R) //CONSTANTS.curiosity.left+ R

        const y_choice = hp(100)-wp(R) //THE THREE CHOICES HAVE THE SAME HEIGHT (i.e., y coordinate)
        if ((gesture.moveX-x_energy)*(gesture.moveX-x_energy)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside energy
            return "energy";
        }
        if ((gesture.moveX-x_mood)*(gesture.moveX-x_mood)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside mood
            return "mood";
        }  
        if ((gesture.moveX-x_curiosity)*(gesture.moveX-x_curiosity)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside curiosity
            return "curiosity";
        }  
        return null

        //USE BELOW IF MORE THAN ONE COIN!

        // for (let choice of Object.keys(choices_info)) {
        //     if (this.collision(gesture, choices_info.choice)){ //this assumes the coin will only collide with ONE container
        //         return {type: choice}
        //     }
        //     break;
        // }
        // return null 
    }
    // collision(gesture, picture_info){
    //     // check collision of gesture release and position of picture
    //     // console.log(position_center, width, height);
    //     //picture_info has properties: {bottom, left, width, height}
    //     // return true
    //     //COMPLETE SOMEHOW
    //     console.log(gesture.moveX, gesture.moveY)
    //     return gesture.moveY < hp(100/3)
    //     const left_x = image_info.x-width/2;
    //     const right_x = image_info.x + width/2;
    //     const down_y = image_info.y-height/2;
    //     const top_y =  image_info.y+ height/2;
    //     console.log(left_x,gesture.moveX, right_x);
    //     console.log(down_y, gesture.moveY, top_y);
    //     return (left_x <= gesture.moveX <= right_x || down_y <= gesture.moveY <= top_y)
    // }
    render() {
        //
        // let scale = this.state.touched ? 1: 1 //scale will be larger when pressed!
        let scale= 1
        //let transform = this.state.pan.getTranslateTransform();
        //console.log(transform)
        console.log("Coin is being rendered!")
        // opacity = 0.5;
        opacity= this.state.opacity;
        if (this.state.showDraggable) {
            if (this.state.movable){
                console.log("rendering animated image of the coin!")
                return (
                    <Animated.Image
                        source = {require('../assets/jibocoin.png')}
                        style={[
                            this.props.position,
                            {opacity: opacity},
                            styles.coin, 
                            {transform: [...this.pan.getTranslateTransform()]}
                        ]}
                        {...this.panResponder.panHandlers}
                    >
                    </Animated.Image>
                )            
            } else{
                return (
                <Image
                source={require('../assets/jibocoin.png')}
                style={[
                    this.props.position,
                    styles.coin,
                ]}
                >
                </Image>)
            }

        } else{
            return null
        }        
    }
    // renderDraggable = () => {
    //     if (this.state.showDraggable) {
    //         return (
    //             <Animated.Image
    //                 style={[styles.container, this.props.position]}
    //                 source = {this.props.image}
    //                 style={[this.props.position, {opacity: this.state.opacity}, styles.animatedView, 
    //                 { transform: this.state.pan.getTranslateTransform()}]}
    //                 {...this._panResponder.panHandlers}
    //             >
    //             </Animated.Image>
    //         )
    //     } else{
    //         console.log("false")
    //         return null
    //     }
    // }
}
const RADIUS= 12;
const styles = StyleSheet.create({
    animatedView: {
        borderColor: "steelblue",
        borderWidth: 10,
        // position: "absolute",
    },
    coin:{
        // flex: 1,
        // flexDirection:"row",
        position: "absolute",
        borderColor: "steelblue",
        // borderWidth: 10,
        // bottom: 0,
        // justifyContent: "space-evenly", 
        // flex: 0, 
        // position: "relative", 
        // top: '50%', 
        // left: '50%'
    },
});


// import React, { Component } from "react";
// import { StyleSheet, View, Text, PanResponder, Animated } from "react-native";

// class Draggable extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       showDraggable: true,
//       dropAreaValues: null,
//       pan: new Animated.ValueXY(),
//       opacity: new Animated.Value(1)
//     };
//     this._val = { x:0, y:0 }
//     this.state.pan.addListener((value) => this._val = value);

//     this.panResponder = PanResponder.create({
//         onStartShouldSetPanResponder: (e, gesture) => true,
//         onPanResponderGrant: (e, gesture) => {
//           this.state.pan.setOffset({
//             x: this._val.x,
//             y:this._val.y
//           })
//           this.state.pan.setValue({ x:0, y:0})
//         },
//         onPanResponderMove: Animated.event([ 
//           null, { dx: this.state.pan.x, dy: this.state.pan.y }
//         ]),
//         onPanResponderRelease: (e, gesture) => {
//           if (this.isDropArea(gesture)) {
//             Animated.timing(this.state.opacity, {
//               toValue: 0,
//               duration: 1000
//             }).start(() =>
//               this.setState({
//                 showDraggable: false
//               })
//             );
//           } 
//         }
//       });
//   }

//   isDropArea(gesture) {
//     return gesture.moveY < 200;
//   }

//   render() {
//     return (
//       <View style={{ width: "20%", alignItems: "center" }}>
//         {this.renderDraggable()}
//       </View>
//     );
//   }

//   renderDraggable() {
//     const panStyle = {
//       transform: this.state.pan.getTranslateTransform()
//     }
//     if (this.state.showDraggable) {
//       return (
//         <Animated.Image
//         source={require('../assets/jibocoin.png')}
//         {...this.panResponder.panHandlers}
//         style={[panStyle, styles.circle, {opacity:this.state.opacity}]}
//         />
//       );
//     }
//   }
// }


// export default class Coin extends Component {
//   render() {
//     return (
//       <View style={styles.mainContainer}>
//         <View style={styles.dropZone}>
//           <Text style={styles.text}>Drop them here!</Text>
//         </View>
//         <View style={styles.ballContainer} />
//         <View style={styles.row}>
//           <Draggable />
//           <Draggable />
//           <Draggable />
//           <Draggable />
//           <Draggable />
//         </View>
//       </View>
//     );
//   }
// }

// let CIRCLE_RADIUS = 60;
// const styles = StyleSheet.create({
//   mainContainer: {
//     flex: 1
//   },
//   ballContainer: {
//     height:200
//   },
//   circle: {
//     width: CIRCLE_RADIUS * 2,
//     height: CIRCLE_RADIUS * 2,
//     borderRadius: CIRCLE_RADIUS
//   },
//   row: {
//     flexDirection: "row"
//   },  
//   dropZone: {
//     height: 200,
//     backgroundColor: "#00334d"
//   },
//   text: {
//     marginTop: 25,
//     marginLeft: 5,
//     marginRight: 5,
//     textAlign: "center",
//     color: "#fff",
//     fontSize: 25,
//     fontWeight: "bold"
//   }
// });
