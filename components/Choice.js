
// //render the three "buckets" of choices

import React from 'react';
import {Animated, View, StyleSheet, Image, ImageBackground} from 'react-native';
import {
  listenOrientationChange as lor,
  removeOrientationListener as rol,
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {ModalChoice} from './ModalChoice.js'
import images from "../assets/images.js"


export class Choice extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            scale: new Animated.Value(0),
            // modalVisible: false,

        }
        // this.showModal= this.showModal.bind(this);
        let {type, label} = this.props.info
        this.image_source = images[type][label].icon;
        this.text_image= images[type][label].text;
        this.changeScale= this.changeScale.bind(this);
    }
    
    // componentWillUnmount() {
    //     rol();
    // }
    componentDidMount() {
        // lor(this);
        // Animated.spring(this.state.scale,{
        //     toValue:1.25,
        //     duration:2000
        // }).start(() => {
        //     Animated.spring(this.state.scale,{
        //         toValue:1,
        //         duration:2000
        //     }).start();
        // });
        this.changeScale(1.25);
    }
    changeScale(toValue){
        Animated.spring(this.state.scale,{
            toValue: toValue,
            duration:1500
        }).start(() => {
            Animated.spring(this.state.scale,{
                toValue:1,
                duration:2000
            }).start();
        });
    }
    render(){
        // console.log("Choice.js is rendering!")
        let visible = this.props.is_visible ? 1: 0
        console.log('visibility of this choice is:',visible)
        console.log(`(width, height)= (${wp(100)},${hp(100)})`);
        let {type, label} = this.props.info;
        let image_source = images[type][label].icon;
        let text_image= images[type][label].text;
        // let opacity = true ? 0.5: 1;
        let opacity= 1;
        // let scale;
        // if (!this.props.modal_shown){
        //     scale = this.state.scale
        // }else{
        //     scale = 1.25
        // }
        if (this.props.modal_shown){
            this.changeScale(1.5);
        }
        // let scale= this.props.modal_shown ? 1.25: this.state.scale;
        let scale= this.props.is_hovered ? 1.25: this.state.scale;
        if (this.props.is_visible){
            return(
                <View source={image_source} style={{opacity: opacity}}>
                    <ModalChoice 
                    image_source={image_source} 
                    text_image = {text_image}
                    message= {"Thank you!"} 
                    modalVisible={this.props.modal_shown} 
                    // showModal={this.showModal}
                    style={styles.showBorders}                    // style= {styles[`${type}_text`]}
                    setModalVisible={this.props.setModalVisible}
                    type={type}
                    />
                    <Image
                    source={text_image}
                    style={[styles[`${type}_text`], styles.showBorders]}
                    />
                    <Animated.Image 
                    source ={image_source}
                    style = {[
                        {transform: [{scale: scale}]},
                        this.props.hope,
                        styles.showBorders,
                        ]}>
        
                    </Animated.Image>
                </View>
            );
        } else{
            return null;
        }
    }
}
const RADIUS= 12;
const styles = StyleSheet.create({
    energy_text: {
        // bottom: hp('5%'),
        // left: hp('25%'),
        position: "absolute",
        bottom: 0,
        // left:0,
        left: wp(50-15*RADIUS/4),
        width: wp(5*RADIUS/2),
        height: wp(5*RADIUS/6),
        // borderRadius:wp(RADIUS),
    },
    mood_text: {
        position:"absolute",
        bottom: 0,
        left:wp(50-5*RADIUS/4),
        width: wp(5*RADIUS/2),
        height: wp(5*RADIUS/6),
        // borderRadius:wp(RADIUS),
    },
    curiosity_text:{
        position: "absolute",
        bottom: 0,
        left:wp(50+5*RADIUS/4),
        width: wp(5*RADIUS/2),
        height: wp(5*RADIUS/6),
    },
    showBorders:{
        borderColor: "steelblue",
        // borderWidth: 10,
    }
});
 