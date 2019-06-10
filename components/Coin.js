import React, {Component} from 'react'
import { ScreenOrientation } from 'expo';
import { StyleSheet, Text, View, Animated, PanResponder, Dimensions, Easing} from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';
// import RNRestart from 'react-native-restart';


export class Coin extends Component{
    constructor(props){
        super(props);
        this.state = {
            pan: new Animated.ValueXY(), //pan is a vector
            opacity: new Animated.Value(1), // for opacity
            showDraggable: true,
        };
    }
    componentDidMount() {
        lor(this);
    }
    
    componentWillUnmount() {
        rol();
    }
    componentWillMount() {
        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,
            onPanResponderGrant: (evt, gestureState) => {
                this.state.pan.setOffset({
                    x: this.state.pan.x._value,
                    y: this.state.pan.y._value
                });
                this.state.pan.setValue({x: 0, y: 0});
            },
            onPanResponderMove: Animated.event([
                    null,
                    {dx: this.state.pan.x, dy: this.state.pan.y}, /*how much has the position changed since
                                                                    begining of the tap*/
            ]),
            onPanResponderRelease: (evt, gestureState) => {
                // console.log('xd',this.state.pan.getLayout())
                this.state.pan.flattenOffset();
                const result = this.general_collision(gestureState); 
                if (result){
                    Animated.timing(this.state.opacity, {
                        toValue: 0,
                        duration: 2000
                    }).start(() => { //Once opacity = 0, the draggable will not be shown anymore
                        this.setState({
                        showDraggable: false
                        })
                        // console.log(this.state.opacity)
                    })
                    this.props.stateChange(result);
                    this.props.usedCoin();
                    // RNRestart.Restart();
                } else{ //coming back to initial state
                   Animated.timing(this.state.pan, { 
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
    
    general_collision(gesture) {
        console.log('collision:', wp(100), hp(100))
        const R = this.props.RADIUS
        console.log(R)
        const x_food = wp(50-2.5*R)
        const x_hug = wp(50)
        const x_med = wp(50+2.5*R)
        const y_choice = hp(100)-wp(R)
        if ((gesture.moveX-x_food)*(gesture.moveX-x_food)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside food
            return "food";
        }
        if ((gesture.moveX-x_hug)*(gesture.moveX-x_hug)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside food
            return "hug";
        }  
        if ((gesture.moveX-x_med)*(gesture.moveX-x_med)+(gesture.moveY-y_choice)*(gesture.moveY-y_choice) <= wp(R)* wp(R)){ //if touch is inside food
            return "medicine";
        }  
        return null
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
        // console.log("rendered draggable")
        // console.log(this.state.pan.x, this.state.pan.y)        
        if (this.state.showDraggable) {
            return (
                    <Animated.Image
                        source = {require('../assets/heart_animated.jpg')}
                        style={[this.props.position, {opacity: this.state.opacity}, styles.animatedView, 
                        { transform: this.state.pan.getTranslateTransform()}]}
                        {...this._panResponder.panHandlers}
                    >
                    </Animated.Image>
            )
        } else{
            console.log("false")
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

const styles = StyleSheet.create({
    animatedView: {
        borderColor: "steelblue",
        borderWidth: 10,
        // position: "absolute",
    }
});

