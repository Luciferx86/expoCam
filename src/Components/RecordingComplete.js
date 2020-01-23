import React, { Component } from 'react';
import ReactNative, { View, Text, Image, Alert, AsyncStorage } from 'react-native';
import Button from './MyButton';
import firebase from 'firebase';
sha3_256 = require('js-sha3').sha3_256;
const ethers = require('ethers');
const contract = require('../Blockchain/Build/Associations.json');
const contractAddress = require('../Blockchain/ContractAddress');
import LoadingOverlay from 'react-native-orientation-loading-overlay';
import details from '../Blockchain/PrivateBlockchain';
import { Actions } from 'react-native-router-flux';

class RecordingComplete extends Component {
    state = {
        address: '',
        uploaded: false,
        loading: false,
        message: ''
    }
    async componentDidMount() {
        try {
            const mnemonic = await AsyncStorage.getItem('wallet');
            const address = await ethers.Wallet.fromMnemonic(mnemonic).address;
            this.setState({
                address: address
            });
        } catch (err) {

        }
    }

    getVideoSignature() {
        firebase.storage().ref('Users/').child(this.state.address)
            .child(this.getFileName()).getDownloadURL().then((url) => {
                fetch(url).then((data) => {
                    data.blob().then((blob) => {
                        var reader = new FileReader();
                        reader.readAsDataURL(blob);
                        reader.onloadend = function () {
                            var base64data = reader.result;
                            // console.log(base64data);
                            const hashdata = sha3_256(base64data);
                            console.log('hashData', hashdata);
                            return hashdata;
                        }
                    })
                })
            })



        // const blob = this.state.blob;

    }

    getFileName() {
        const str = this.props.file;
        const arr = str.split('/');
        const name = arr[arr.length - 1];
        return name;
    }
    componentWillUnmount() {
        this.setState({
            loading: false
        })
    }
    async addToBlockChain() {

        let privateKey = '04F0F4ED3448E19166411D76D81A8970DDCCCBB6DD4192345222821F8948A5A0';
        console.log(this.getFileName());
        let abi = contract.interface;
        // let provider = new ethers.providers.InfuraProvider('rinkeby');
        let provider = new ethers.providers.JsonRpcProvider(details);
        let wallet = new ethers.Wallet(privateKey, provider);
        let deployedContract = new ethers.Contract(contractAddress.default, abi, wallet);
        const fileName = this.getFileName();
        if (this.state.uploaded) {
            firebase.storage().ref('Users/').child(this.state.address)
                .child(this.getFileName()).getDownloadURL().then((url) => {
                    fetch(url).then((data) => {
                        data.blob().then((blob) => {
                            var reader = new FileReader();
                            reader.readAsDataURL(blob);
                            reader.onloadend = function () {
                                var base64data = reader.result;
                                // console.log(base64data);
                                const hashdata = sha3_256(base64data);
                                console.log('hashData', hashdata);
                                // return hashdata;
                                deployedContract.addAssoc(fileName, hashdata);
                                console.log('added to bC');
                                alert('Video Signature Added to Blockchain');
                                Actions.reset('dashboard');
                            }
                        })
                    })
                })
        } else {
            alert('Video not uploaded on Database');
        }
    }

    getCurrentDate() {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var currDate = date + '/' + month + '/' + year;
        return currDate;
    }

    async tryUpload() {
        if (!this.state.uploaded && !this.state.loading) {
            console.log("trying to upload file");
            this.setState({
                loading: true,
                message: 'Uploading to Database'
            })
            const fileUri = this.props.file;
            const file = await fetch(fileUri);
            const blob = await file.blob();
            if (blob) {
                this.setState({
                    blob
                });
                console.log("FIle Not nUll");
                firebase.storage().ref('Users/').child(this.state.address).child(this.getFileName()).put(blob)
                    .then((data) => {
                        //success callback
                        firebase.database().ref('Users/')
                            .child(this.state.address)
                            .push({ name: this.getFileName(), date: this.getCurrentDate() });
                        Alert.alert("Done Upload");
                        this.setState({
                            uploaded: true,
                            loading: false
                        })
                        console.log("DONE UPLOAD");
                        console.log('data ', data)
                    }).catch((error) => {
                        //error callback
                        Alert.alert("error");
                        console.log('error ', error)
                    })
            } else {
                console.log("file null");
            }
        } else {
            if (this.state.loading) {
                alert('Work In Progress...');
            }else{
                alert('File Already Uploaded');
            }
        }
    }
    render() {
        // console.log(this.props.fileName);
        return (
            <View style={{
                alignSelf: 'center',
                alignContent: 'center',
                marginTop: 30
            }}>
                {/* <LoadingOverlay
                    visible={this.state.loading}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message={this.state.message}
                /> */}
                <View style={{
                    alignContent: 'center',
                    alignSelf: 'center',
                    borderWidth: 3,
                    height: 200,
                    width: 100
                }}>
                    <Image source={{ uri: this.props.file }}
                        style={{
                            width: '100%',
                            height: '100%'
                        }} />
                </View>
                <Text style={{
                    fontSize: 24,
                }}>Video Signature:</Text>
                <Text style={{
                    fontSize: 20,
                }}>{this.getFileName()}</Text>
                <View style={{
                    marginTop: 20
                }}>
                    <Button text="Upload to Database" onPress={() => { this.tryUpload() }} />
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <Button text="Upload to BlockChain" onPress={() => { this.addToBlockChain(); }} />
                </View>
            </View>
        )
    }
}
export default RecordingComplete;