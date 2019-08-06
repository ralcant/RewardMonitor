import React from 'react'
import {Modal, Text, View, Image, StyleSheet, TouchableHighlight} from 'react-native'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
    listenOrientationChange as lor,
    removeOrientationListener as rol
  } from 'react-native-responsive-screen';

export class ModalChoice extends React.Component{
    constructor(props){
        super(props);
    }
    // async componentDidMount(){
    //     lor(this);
    // }
    // async componentWillUnmount(){
    //     rol()
    // }
    render(){
        return(
            <Modal
            animationType="slide"
            transparent={true}
            // visible={this.props.modalVisible}
            visible = {false}
            // style={styles.modal_container}
            onRequestClose={()=>{
                console.log("Closed Modal!");
            }}>
                <View style={styles.modal_container}>
                    <View style= {styles.modal_inner_container}>
                        <Image style={styles.icon} source={this.props.image_source}/>
                        <Image style={styles.text_image} source={this.props.text_image}/>
                        <Text style={styles.message}>{this.props.message}</Text>
                        {/* <TouchableHighlight
                            style={styles.closeButton}
                            onPress={() => {
                            this.props.setModalVisible(this.props.type,false);
                            }}>
                            <Text style={{fontSize: 12}}>Close</Text>
                        </TouchableHighlight> */}
                    </View>
                </View>
            </Modal>
        );
    }
}
const styles= StyleSheet.create({
    icon: {
        position: "absolute",
        width: wp(30),
        height: wp(30),
        // padding: 10,
        left:wp(20),
        bottom:wp(10),
    },
    text_image:{
        position: "absolute",
        left: wp(20),
        width: wp(30),
        height: wp(10),
        bottom:0,
    },
    message:{
        fontSize:50,
    },
    closeButton: {
        // marginTop: 80,
        padding: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRadius: 6,
        borderColor: '#000000',
    },
    modal_container:{
        opacity: 2,
        flex:1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems:"center", 
    },
    modal_inner_container:{
        display: "flex",
        alignItems:"center",
        width: wp(70),
        height: hp(80),
        // padding: 25,
        borderWidth: 2,
        borderColor: "black",
        backgroundColor: "white",
        borderRadius: wp(5),
        borderStyle: "solid",
    }
})
