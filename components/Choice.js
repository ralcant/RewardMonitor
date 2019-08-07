
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
        this.type = this.props.info.type        
        // this.image_source = images[type][label].icon;
        // this.text_image= images[type][label].text;
        this.handleColission= this.handleColission.bind(this);
    }
    
    // componentWillUnmount() {
    //     rol();
    // }
    componentDidMount() {
        // lor(this);
        Animated.spring(this.state.scale,{
            toValue:1.25,
            duration:2000
        }).start(() => {
            Animated.spring(this.state.scale,{
                toValue:1,
                duration:2000
            }).start();
        });
    }
    handleColission(toValue){
        // Animated.sequence([
        //     Animated.timing(this.state.scale,{
        //         toValue: toValue,
        //         duration:1500
        //     }),
        //     Animated.spring(this.state.scale,{
        //         toValue:1,
        //         duration:500
        //     })
        // ]).start(()=>{
        //     this.props.change_showing_text()
        //     this.props.send_robot_tts_cmd(this.type);
        // });
        // this.props.hide_text(this.type)

        Animated.spring(this.state.scale,{
            toValue: toValue,
            duration:1000
        }).start(() => {
            // this.props.change_showing_text()
            Animated.spring(this.state.scale,{
                toValue:1,
                duration:500
            }).start(()=>{
                this.props.change_showing_text()
                this.props.send_robot_tts_cmd(this.type);
            });
            // this.props.change_showing_text()
            // this.props.send_robot_tts_cmd(type);

        });
    }
    render(){
        // console.log("Choice.js is rendering!")
        // let visible = this.props.is_visible ? 1: 0
        // console.log('visibility of this choice is:',visible)
        // console.log(`(width, height)= (${wp(100)},${hp(100)})`);
        if (this.props.is_chosen){
            this.handleColission(1.5);
            // this.props.send_robot_tts_cmd(type)
        }
        let {label} = this.props.info;
        let image_source = images[this.type][label].icon;
        let text_image= images[this.type][label].text;
        // let opacity = true ? 0.5: 1;
        let opacity= 1;
        // if (this.props.is_chosen){
        //     this.handleColission(1.5);
        //     // this.props.send_robot_tts_cmd(type)
        // }
        // let scale= this.props.modal_shown ? 1.25: this.state.scale;
        // let scale= this.props.is_hovered ? 1.25: this.state.scale;
        // let scale = this.state.scale;
        if (this.props.is_visible){
            // if (this.props.is_chosen){
            //     this.handleColission(1.5);
            // // this.props.send_robot_tts_cmd(type)
            // }
            return(
                <View>
                    {/* <ModalChoice 
                    image_source={image_source} 
                    text_image = {text_image}
                    message= {"Thank you!"} 
                    modalVisible={this.props.modal_shown} 
                    // showModal={this.showModal}
                    style={styles.showBorders}                    // style= {styles[`${type}_text`]}
                    setModalVisible={this.props.setModalVisible}
                    type={type}
                    /> */}
                    {this.props.show_text &&
                    <Image
                    source={text_image}
                    style={[styles[`${this.type}_text`], styles.showBorders]}
                    />
                    }
                    <Animated.Image 
                    source ={image_source}
                    style = {[
                        // ,
                        this.props.hope,
                        {transform: [{scale: this.state.scale}]},
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
