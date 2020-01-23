import React, { Component } from 'react';
import ReactNative, { View, Text, AsyncStorage, ScrollView } from 'react-native';
import StoreItem from './StoreItem'
import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import LoadingOverlay from 'react-native-orientation-loading-overlay';
const ethers = require('ethers');

class MyStore extends Component {
    state = {
        address: '',
        fileNames: [],
        fetching: true
    }

    componentWillUnmount() {
        this.setState({
            fetching: false
        })
    }

    renderList() {
        console.log('rendering list');
        if (this.state.fileNames.length != 0) {
            return this.state.fileNames.map((val) => {
                console.log('rendering item');
                return (
                    <StoreItem
                        fileName={val.name}
                        keyz={val.name}
                        date={val.date}
                        onPress={() => {
                            Actions.videoplayer({ fileName: val.name })
                        }} />
                )
            })
        } else {
            return (
                <View style={{
                    alignSelf: 'center'
                }}>
                    <Text style={{
                        fontSize: 20
                    }}>
                        Empty Store
                    </Text>
                </View>
            )
        }
    }


    componentDidMount() {
        const arr = this.state.fileNames;
        this.loadAddress().then(() => {
            const val = firebase.database().ref('Users/').child(this.state.address);
            updateStateWithArr = (array) => {
                this.setState({
                    fileNames: array
                });
            }
            val.on('value', (snapshot) => {
                snapshot.forEach(function (childSnapshot) {
                    if (childSnapshot.key != 'Email' && childSnapshot.key != 'PendingRequests') {
                        arr.push(childSnapshot.val());
                        console.log('addding value:');
                        console.log(childSnapshot.val());
                        this.updateStateWithArr(arr);
                    }
                });
            });
        }).then(() => {
            this.setState({
                fetching: false
            })
        });
    }
    async loadAddress() {

        try {
            const val = await AsyncStorage.getItem('wallet');
            const wallet = await ethers.Wallet.fromMnemonic(val);
            // console.log(wallet.address);
            console.log(wallet.address);
            this.setState({
                address: wallet.address
            });
            // return add;
        } catch (err) {
            console.log(err, 'yoyo');
        }
    }
    render() {
        return (
            <View>
                <LoadingOverlay
                    visible={this.state.fetching}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message="Fetching Files..."
                />
                <Text style={{
                    fontSize: 20
                }}>My Items:</Text>
                <ScrollView>
                    {this.renderList()}
                </ScrollView>
            </View>
        )

    }
}

export default MyStore;