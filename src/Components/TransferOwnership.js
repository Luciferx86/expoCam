import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage, Alert } from 'react-native';
import Input from './CustomInput';
import Button from './MyButton';
const ethers = require('ethers');
import firebase from 'firebase';
import LoadingOverlay from 'react-native-orientation-loading-overlay';
import { Actions } from 'react-native-router-flux';
const contract = require('../Blockchain/Build/Associations.json');
const contractAddress = require('../Blockchain/ContractAddress');
import details from '../Blockchain/PrivateBlockchain';

class TransferOwnership extends Component {
    state = {
        myAddress: '',
        newEmail: '',
        mnemonic: '',
        allAddresses: [],
        allUsers: [],
        overlayMessage: 'Loading Users...',
        fetching: true,
        transfering: false
    }
    componentWillUnmount() {
        this.setState({
            fetching: false,
            transfering: false
        })
    }

    componentDidMount() {
        this.loadUsers();
        this.loadAddress();
    }

    initializeFirbase() {
        var firebaseConfig = {
            apiKey: "AIzaSyDZlzoGFYK4dJzekoDcoRHyP7xwXMcLnbM",
            authDomain: "manager-3e85b.firebaseapp.com",
            databaseURL: "https://manager-3e85b.firebaseio.com",
            projectId: "manager-3e85b",
            storageBucket: "manager-3e85b.appspot.com",
            messagingSenderId: "546961250666",
            appId: "1:546961250666:web:19337db4a3acc94d"
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
    }

    async loadAddress() {
        try {
            const mnemonic = await AsyncStorage.getItem('wallet');
            const address = ethers.Wallet.fromMnemonic(mnemonic).address;
            console.log('address loaded', address);
            this.setState({
                myAddress: address
            });

        } catch (err) {
            console.log(err);
        }
    }

    loadUsers() {
        const val = firebase.database().ref('Users/');
        const allAddresses = this.state.allAddresses;
        const allUsers = this.state.allUsers;
        val.once('value', (snapshot) => {
            snapshot.forEach(function (childSnapshot) {
                if (!allAddresses.includes(childSnapshot.key)) {
                    console.log('nextUser', childSnapshot.child('Email').val());
                    allAddresses.push(childSnapshot.key);
                    allUsers.push({
                        address: childSnapshot.key,
                        email: childSnapshot.child('Email').val()
                    })
                }
            });
        }).then(() => {
            this.setState({
                allAddresses,
                allUsers,
                fetching: false
            })
            console.log(this.state);
        });
    }

    async verifyMnemonic() {
        const storedMnemonic = await AsyncStorage.getItem('wallet');
        const enteredMnemonic = this.state.mnemonic;
        if (storedMnemonic === enteredMnemonic) {
            return true;
        } else {
            alert('Invalid mnemonic');
            return false;
        }
    }

    getAddressFromEmail(email) {
        // const email = this.state.newEmail;
        let address = '';
        this.state.allUsers.forEach((obj) => {
            if (obj.email == email) {
                address = obj.address;
            }
        })
        console.log('returning address', address);
        return address;
    }

    verifyUser() {
        const email = this.state.newEmail;
        let result = false;
        // else if (address == myAddress) {
        //     alert('Cannot Transfer to Self');
        //     this.setState({
        //         transfering: false
        //     })
        //     return false;
        // }
        this.state.allUsers.forEach((obj) => {
            if (obj.email == email) {
                result = true;
            }
        })

        if (!result) {
            alert('User doesn\'t exist');
        }
        return result;
    }


    confirmTransfer() {
        Alert.alert(
            'Transfer Ownership',
            'Are you sure?',
            [
                { text: 'Yes, Transfer', onPress: () => { this.trasnferOwnership(); } },
                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'destructive' }
            ],
            { cancelable: false }
        )
    }
    getCurrentDate() {
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        var currDate = date + '/' + month + '/' + year;
        return currDate;
    }

    async getSignature() {
        let privateKey = '04F0F4ED3448E19166411D76D81A8970DDCCCBB6DD4192345222821F8948A5A0';
        // console.log(this.getFileName());
        let abi = contract.interface;
        let provider = new ethers.providers.JsonRpcProvider(details);
        let wallet = new ethers.Wallet(privateKey, provider);
        let deployedContract = new ethers.Contract(contractAddress.default, abi, wallet);
        const fileName = this.props.fileName;
        const signature = await deployedContract.getAssoc(fileName);
        return signature;
    }
    async trasnferOwnership() {
        console.log('loading new Address', this.getAddressFromEmail(this.state.newEmail));
        const fileName = this.props.fileName;
        const myAddress = this.state.myAddress;
        const date = this.getCurrentDate();
        const newAddress = this.getAddressFromEmail(this.state.newEmail);
        const sender = await AsyncStorage.getItem('email');
        console.log('newAddress', newAddress);
        this.setState({
            transfering: true,
            overlayMessage: 'Transferring...'
        })

        if (this.verifyMnemonic() && this.verifyUser()) {
            console.log('things verified, lets go');
            this.getSignature().then((sig) => {
                console.log(sig);
                firebase.database().ref('Users/').child(newAddress)
                    .child('PendingRequests').push({
                        Date: date,
                        File: fileName,
                        Signature: sig,
                        Sender: sender
                    }).then(() => {
                        alert('A transfer request has been sent to ' + this.state.newEmail);
                    }).then(() => {
                        Actions.reset('dashboard');
                    });
            });
        }

    }
    render() {
        return (
            <View style={{
                alignSelf: 'center'
            }}>
                {this.state.transferrring || this.state.fetching ?
                    <LoadingOverlay
                        visible={this.state.fetching || this.state.transfering}
                        color="white"
                        indicatorSize="large"
                        messageFontSize={24}
                        message={this.state.overlayMessage}
                    />
                    : null
                }
                {/* <Text>{this.props.fileName}</Text> */}
                <Text style={{
                    fontSize: 20
                }}>{this.props.fileName}</Text>
                <View style={{
                    marginTop: 20
                }}>
                    <Text>Enter Email of new Owner:</Text>
                    <Input placeHolder='Email'
                        icon='envelope'
                        onChangeText={(val) => {
                            this.setState({
                                newEmail: val
                            })
                        }} />
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <Text>Enter your mnemonic phrase:</Text>
                    <Input placeHolder='Mnemonic'
                        icon='lock'
                        onChangeText={(val) => {
                            this.setState({
                                mnemonic: val
                            })
                        }} />
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <Button text='Transfer' onPress={() => {
                        this.confirmTransfer();
                    }} />
                </View>
            </View>
        )
    }
}

export default TransferOwnership;