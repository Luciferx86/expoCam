import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage, Clipboard, Alert } from 'react-native';
import Button from './MyButton';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
const ethers = require('ethers');
const contract = require('../Blockchain/Build/Associations.json');
import details from '../Blockchain/PrivateBlockchain';


class Dashboard extends Component {
    state = {
        wallet: null,
        pendingRequests: 0
    }

    checkPendingRequests(address) {
        console.log('checking pending requests');
        let pendingRequests = 0;
        console.log(address);
        if (this.props.start) {
            firebase.database().ref('Users/').child(address)
                .child('PendingRequests').once('value', (snapshot) => {
                    console.log(snapshot.val());
                    snapshot.forEach((childSnapshot) => {
                        console.log(childSnapshot);
                        pendingRequests++;
                        console.log(pendingRequests);
                    })
                }).then(() => {
                    console.log('pending', pendingRequests);
                    if (pendingRequests > 0) {
                        Alert.alert(
                            'Pending Requests',
                            'You have ' + pendingRequests + ' pending requests',
                            [
                                { text: 'View Requests', onPress: () => { Actions.pendingrequests(); } },
                                { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'destructive' }
                            ],
                            { cancelable: false }
                        )
                    }
                    this.setState({
                        pendingRequests
                    })
                }).catch((err) => {
                    console.log(err);
                })
            console.log(pendingRequests);
        }
    }
    async componentDidMount() {
        console.log(this.props.wallet);
        try {

            const value = await AsyncStorage.getItem('wallet');

            if (value !== null) {
                // this.checkPendingRequests();
                console.log("got walet");
                const wallet = ethers.Wallet.fromMnemonic(value);
                this.checkPendingRequests(wallet.address);
                this.setState({ wallet });
            }
        } catch (error) {
            // Error retrieving data
            console.log(error);
        }
    }
    render() {
        // let wallet = this.state.wallet;
        return (
            <View style={{
                alignSelf: 'center'
            }}>
                <Text style={{ fontSize: 30, margin: 20 }}>
                    My Address:
                </Text>
                <Text style={{ fontSize: 20, margin: 20 }}>
                    {this.state.wallet ? this.state.wallet.address : 'Fetching Account...'}
                </Text>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="Copy Address" onPress={() => {
                        Clipboard.setString(this.state.wallet.address);
                        alert('Address Copied to Clipboard');
                    }} />
                </View>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="My Store" onPress={() => {
                        Actions.mystore();
                    }} />
                </View>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="Add Item" onPress={() => {
                        Actions.video();
                    }} />
                </View>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="Pending Requests" onPress={() => {
                        Actions.pendingrequests();
                    }} />
                </View>
                {/* <View style={{
                    marginTop: 30
                }}>
                    <Button text="Send Mail" onPress={() => {
                        Actions.sendmail();
                    }} />
                </View> */}

            </View>
        )
    }
}

export default Dashboard;