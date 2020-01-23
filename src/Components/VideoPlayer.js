import React, { Component } from 'react';
import ReactNative, { View, AsyncStorage } from 'react-native';
import { Video } from 'expo-av';
import firebase from 'firebase';
const ethers = require('ethers');
import Button from './MyButton';
import LoadingOverlay from 'react-native-orientation-loading-overlay';
import { Actions } from 'react-native-router-flux';
const sha3_256 = require('js-sha3').sha3_256;
const contract = require('../Blockchain/Build/Associations.json');
const contractAddress = require('../Blockchain/ContractAddress');
import { FileSystem } from 'expo';
import details from '../Blockchain/PrivateBlockchain';


class VideoPlayer extends Component {
    state = {
        address: '',
        uri: '',
        fetching: true,
        muted: false
    }

    async loadAddress() {
        try {
            const mnemonic = await AsyncStorage.getItem('wallet');
            const wallet = ethers.Wallet.fromMnemonic(mnemonic);
            const address = wallet.address;
            this.setState({
                address
            })
            console.log(this.state);
        } catch (err) {
            console.log(err);
        }
    }
    async componentDidMount() {
        // this.initializeFirbase();
        try {
            this.loadAddress().then(() => {
                this.getUri();
            });
        } catch (err) {
            console.log(err);
        }
    }
    async getUri() {

        const fileName = this.props.fileName;
        // const fileName = '7664b858-cccc-494a-8690-1f81ef339bfa.mp4'
        console.log('printing fileName');
        console.log(fileName);
        if (this.state.address !== '') {
            firebase.storage().ref('Users/').child(this.state.address).child(fileName).getDownloadURL()
                .then(async (url) => {
                    console.log(url);
                    this.setState({
                        uri: url,
                        fetching: false
                    })
                })
        } else {
            console.log('address null');
        }
    }

    async getSignature() {
        let privateKey = '04F0F4ED3448E19166411D76D81A8970DDCCCBB6DD4192345222821F8948A5A0';
        // console.log(this.getFileName());
        let abi = contract.interface;
        let provider = new ethers.providers.JsonRpcProvider(details);
        let wallet = new ethers.Wallet(privateKey, provider);
        let deployedContract = new ethers.Contract(contractAddress.default, abi, wallet);
        console.log(deployedContract);
        const fileName = this.props.fileName;
        const signature = await deployedContract.getAssoc(fileName);
        console.log(signature);
        alert(signature);
    }
    componentWillUnmount() {
        this.setState({
            muted: true,
            fetching: false
        })
    }

    renderVideo() {
        if (this.state.uri !== '') {
            return (
                <Video
                    source={{ uri: this.state.uri !== '' ? this.state.uri : null }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={this.state.muted}
                    resizeMode="contain"
                    shouldPlay
                    isLooping
                    style={{ height: 300 }}
                />
            )
        }
    }

    render() {
        return (
            <View style={{
                flex: 1,
                alignSelf: 'center',

            }}>
                <LoadingOverlay
                    visible={this.state.fetching}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Fetching Video..."
                />
                {this.renderVideo()}
                <Button text="View Signature" onPress={() => {
                    this.getSignature();
                }} />
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="Transfer Ownership" onPress={() => {
                        Actions.transfer({ fileName: this.props.fileName });
                    }} />
                </View>
            </View>
        )
    }
}

export default VideoPlayer;