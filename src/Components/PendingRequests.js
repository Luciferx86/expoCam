import React, { Component } from 'react';
import ReactNative, { View, Text, ScrollView, AsyncStorage, Alert } from 'react-native';
import SingleRequest from './SingleRequest';
import firebase from 'firebase';
import LoadingOverlay from 'react-native-orientation-loading-overlay';
import { Actions } from 'react-native-router-flux';
const ethers = require('ethers');

class PendingRequests extends Component {

    state = {
        requests: [],
        allAddresses: [],
        allUsers: [],
        myAddress: '',
        loading: true
    }


    loadUsers() {
        const val = firebase.database().ref('Users/');
        const allUsers = this.state.allUsers;
        const allAddresses = this.state.allAddresses;
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
                loading: false
            })
            console.log(this.state);
        });
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

    confirmTransfer(obj) {
        const myAddress = this.getAddressFromEmail(obj.Sender);
        const newAddress = this.state.myAddress;
        const fileName = obj.File;

        console.log('trying to transfer');
        firebase.storage().ref('Users/').child(myAddress)
            .child(fileName).getDownloadURL()
            .then((url) => {
                console.log('got URL', url);
                fetch(url)
                    .then(res => res.blob()) // Gets the response and returns it as a blob
                    .then(blob => {
                        console.log('got file');
                        firebase.storage().ref('Users/').child(newAddress)
                            .child(fileName)
                            .put(blob)
                            .then(() => {
                                firebase.storage().ref('Users/').child(myAddress)
                                    .child(fileName).delete();
                            })
                            .then(() => {
                                firebase.database().ref('Users/').child(myAddress)
                                    .on('value', (snapshot) => {
                                        snapshot.forEach(function (childSnapshot) {
                                            if (childSnapshot.val().name === fileName) {
                                                firebase.database().ref('Users/').child(newAddress)
                                                    .push(childSnapshot.val());
                                                firebase.database().ref('Users/').child(myAddress)
                                                    .child(childSnapshot.key).remove();
                                            }
                                        });
                                    });
                            }).then(() => {
                                firebase.database().ref('Users/').child(newAddress)
                                    .child('PendingRequests').once('value', (snapshot) => {
                                        snapshot.forEach((childSnapshot) => {
                                            if (childSnapshot.val().File == fileName) {
                                                firebase.database().ref('Users').child(newAddress)
                                                    .child('PendingRequests')
                                                    .child(childSnapshot.key).remove();
                                            }
                                        })
                                    })
                            }).then(() => {
                                alert('Transfer Complete.');
                                Actions.reset('dashboard');
                            });
                    });
            });


    }

    rejectRequest(obj) {
        const newAddress = this.state.myAddress;
        const fileName = obj.File;
        firebase.database().ref('Users/').child(newAddress)
            .child('PendingRequests').once('value', (snapshot) => {
                snapshot.forEach((childSnapshot) => {
                    if (childSnapshot.val().File == fileName) {
                        firebase.database().ref('Users').child(newAddress)
                            .child('PendingRequests')
                            .child(childSnapshot.key).remove();
                    }
                })
            }).then(() => {
                alert('Request Rejected');
                Actions.reset('dashboard');
            })
    }

    renderRequests() {
        console.log('rendering requests');
        if (this.state.requests.length != 0) {
            return this.state.requests.map((obj) => {
                console.log('Object', obj);
                return (
                    <SingleRequest
                        obj={obj}
                        onAccept={() => {
                            this.confirmTransfer(obj);
                        }}
                        onReject={() => {
                            Alert.alert(
                                'Reject Request',
                                'Are you Sure?',
                                [
                                    { text: 'Reject', onPress: () => { this.rejectRequest(obj) } },
                                    { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'destructive' }
                                ],
                                { cancelable: false }
                            )
                        }}
                    />
                )
            })
        } else {
            return (
                <View>
                    <Text>No Requests</Text>
                </View>
            )
        }

    }

    async loadRequests() {
        console.log('loading requests');
        let requests = [];
        try {
            const mnemonic = await AsyncStorage.getItem('wallet');
            const address = ethers.Wallet.fromMnemonic(mnemonic).address;
            firebase.database().ref('Users/').child(address)
                .child('PendingRequests').once('value', (snapshot) => {
                    snapshot.forEach((childSnapshot) => {
                        console.log(childSnapshot.val());
                        requests.push(childSnapshot.val());
                    })
                }).then(() => {
                    this.setState({
                        requests,
                        myAddress: address
                    })
                });
        } catch (err) {
            console.log(err);
        }
    }

    componentDidMount() {
        this.loadRequests().then(() => {
            this.loadUsers();
        });
    }
    render() {
        return (
            <View>
                <LoadingOverlay
                    visible={this.state.loading}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message='Fetching Requests...'
                />
                <ScrollView>
                    {this.renderRequests()}
                </ScrollView>
            </View>
        )
    }
}

export default PendingRequests;