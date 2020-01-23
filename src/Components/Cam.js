import React from 'react';
import { Text, View, TouchableOpacity, CameraRoll, Dimensions } from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Flasher from './Col';
import { Actions } from 'react-native-router-flux';

export default class CameraExample extends React.Component {
    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.front,
        reocrding: false
    };

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({ hasCameraPermission: status === 'granted' });
    }

    renderFlasher() {
        if (this.state.recording) {
            return (
                <View style={{
                    // flex:1, 
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                }}>
                    <Flasher />
                </View>
            )
        }
    }

    snap = async () => {
        if (this.camera) {
            this.setState({
                recording: true
            })
            console.log("no error");
            // let photo = await this.camera.takePictureAsync();
            let vid = await this.camera.recordAsync({
                maxDuration: 2,
            });
            CameraRoll.saveToCameraRoll(vid.uri)
                .then(() => {
                    console.log('saved');
                    this.setState({
                        recording: false
                    })
                    Actions.complete({ file: vid.uri });
                })
                .catch((err) => { console.log(err) });
            console.log(vid.uri);
        } else {
            console.log("erorr")
        }
    };
    render() {

        const { hasCameraPermission } = this.state;
        if (hasCameraPermission === null) {
            return <View />;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{ flex: 1, width: Dimensions.get('window').width }}>
                    {/* {this.renderFlasher()} */}
                    <Camera style={{ flex: 1 }} type={this.state.type} ref={ref => {
                        this.camera = ref;
                    }}>
                        {this.renderFlasher()}
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: 'transparent',
                                flexDirection: 'row',
                            }}>
                            <TouchableOpacity
                                style={{
                                    flex: 0.1,
                                    alignSelf: 'flex-end',
                                    alignItems: 'center',
                                }}
                                onPress={() => {
                                    this.setState({
                                        type:
                                            this.state.type === Camera.Constants.Type.back
                                                ? Camera.Constants.Type.front
                                                : Camera.Constants.Type.back,
                                    });
                                }}>
                                <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.snap} style={{
                                flex: 0,
                                backgroundColor: '#fff',
                                borderRadius: 5,
                                padding: 15,
                                paddingHorizontal: 20,
                                alignSelf: 'center',
                                margin: 20,
                            }}>
                                <Text style={{ fontSize: 14 }}> {this.state.recording ? 'RECORDING...' : 'RECORD'} </Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
                    {/* {this.renderFlasher()} */}
                </View>
            );
        }
    }
}