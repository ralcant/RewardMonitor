let ROSLIB = require('roslib')
import {sleep} from "./components/sleep.js"
// import {JiboAction} from './jibo_msgs/msg/JiboAction'



export class RosClient{
    constructor(){
        this.jibo_publisher = null;
        this.rosbridge_client = null;
        this.setupRosbridgeClient = this.setupRosbridgeClient.bind(this);
        this.setupPublisher = this.setupPublisher.bind(this);
        this.on_msg_received = this.on_msg_received.bind(this);
        this.is_playing = false;
        // this.jibo_topic = new ROSLIB.Topic({
        //     ros: ros,
        //     name: "/jibo",
        //     messageType: JiboAction 
        // })
        this.robot_state = null;
    }
    async send_robot_tts_cmd(text){ //, callback ){

        let new_message = new ROSLIB.Message({
            header: {
                frame_id : "JiboAction"
              },
            do_motion: false,
            do_tts: true,
            do_lookat: false,
            tts_text: text,
        })
        // console.log('this.jibo_publisher=',this.jibo_publisher)
        let that = this;
        return new Promise(async function(resolve, reject) {
            console.log('trying to send the message: '+ text);
            that.jibo_publisher.publish(new_message);
            while (!that.is_playing) {
                console.log("this.is_playing is false right now")
                await sleep(200)
                // let p =that.sleep(200);
                // p.then(()=>{})
            }
            while( that.is_playing){
                console.log("this.is_playing is true right now")
                await sleep(200)
                // let p2= that.sleep(200);
                // p2.then(() =>{})
            }
            resolve("Done playing TTS");
        })
    }
    say_from_json(dict, type_of_script){
        //TODO: know how to retrieve info of the dic
        //Assumes the format of the json is something_01, something_02, ...something_xy

        let count = 1
        this.send_robot_tts_cmd("Trying to go with the scripts for: "+ type_of_script)
        // let keep = true;
        while (true){
            let new_script;
            if (count < 10){
                new_script = type_of_script + "_0" + count; 
            }
            else{
                new_script = type_of_script + "_" + count; //assumes count is <100 (reasonable assumption)
            }
            if (new_script in dict){ 
                console.log('new_script is: '+ new_script)
                this.send_robot_tts_cmd(dict[new_script]["esml"]) 
                count++; 
            }
            else{
                // keep = false;
                break;
            }
        }
    }
    setupStateSubscriber(){
        this.robot_state = new ROSLIB.Topic({
            ros: this.rosbridge_client,
            name: '/jibo_state',
            messageType: '/jibo_msgs/JiboState',
            throttle_rate: 1000
        })
        this.robot_state.subscribe(this.on_msg_received)
    }
    on_msg_received(data){
        //callback for subscriber
        this.is_playing = data.is_playing_sound || data.doing_motion;
        /* this.is_playing will be False only if 
        Jibo is not playing any sound or moving at all */
        
    }
    setupPublisher(){
        this.jibo_publisher= new ROSLIB.Topic({
            // ros:ros,
            ros: this.rosbridge_client,
            name: '/jibo',
            messageType: '/jibo_msgs/JiboAction',
            throttle_rate: 1000
        });
    }
    close(){
        console.log("trying to close the connection...")
        this.robot_state.unsubscribe();        
        this.rosbridge_client.close()
    }
    setupRosbridgeClient(){
        console.log("Trying to connect to Jibo!")
        let that = this
        // let IP = "localhost" //how to get actual IP?
        let IP = "192.168.41.97" 
        this.rosbridge_client = new ROSLIB.Ros({
            url: "ws://" + IP + ":9090"
        })
        this.rosbridge_client.on('connection', () => {
            console.log("connection confirmed! yayy")
            // that.jibo_publisher= new ROSLIB.Topic({
            //     ros: this.rosbridge_client,
            //     messageType: 'jibo_messages/JiboAction',
            //     throttle_rate: 1000
            // });
            // console.log(that)
            that.setupPublisher();
            // console.log("got here!")
            //also the subscriber? --> not for now
        });
        this.rosbridge_client.on('error', (error) => {
            console.log("Error connecting to websocket server, trying again in 2s:", error);
            setTimeout(()=> {
                this.setupRosbridgeClient();
            }, 2000); 
        });
        this.rosbridge_client.on('close', ()=>{
            console.log("Connection to websocket server closed");
            // setTimeout(()=> {
            //     this.setupRosbridgeClient();
            // }, 2000); 
        })
    }

}