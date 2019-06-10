
// //render the three "buckets" of choices

import React from 'react';
import {Animated} from 'react-native';
import {
  listenOrientationChange as lor,
  removeOrientationListener as rol
} from 'react-native-responsive-screen';

export class Choice extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            scale: new Animated.Value(0)
        }
    }
    
    componentWillUnmount() {
        rol();
    }
    componentDidMount() {
        lor(this);
        Animated.spring(this.state.scale,{
            toValue:1.5,
            duration:2000
        }).start(() => {
            Animated.spring(this.state.scale,{
                toValue:1,
                duration:2000
            }).start();
        });
    }
    render(){
        console.log(this.state.orientation)

        return(
            <Animated.Image 
            source ={this.props.image}
            style = {[{transform: [{scale: this.state.scale}]}, this.props.hope]}>

            </Animated.Image>
        );
    }
}