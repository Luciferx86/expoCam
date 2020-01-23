import React, { Component } from 'react';
import ReactNative, { View, Text, Image, AsyncStorage } from 'react-native';
const ethers = require('ethers');
import { Font } from 'expo';
import Button from './MyButton';
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';

class Login extends Component {
    async componentWillMount() {
        this.initializeFirbase();
    }
    async componentDidMount() {
        try {
            const value = await AsyncStorage.getItem('wallet');
            console.log('value');
            console.log(value);
            if (value !== null) {
                // We have data!!
                Actions.reset('dashboard',{
                    start: true
                });
                console.log(value);
            }
        } catch (error) {
            // Error retrieving data
        }
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
    async createAccount() {
        const wallet = ethers.Wallet.createRandom();
        console.log(wallet.privateKey);
        console.log(wallet.mnemonic);
        try {
            // await AsyncStorage.setItem('wallet', wallet.mnemonic);
            Actions.created({ wallet });
        } catch (error) {
            // Error saving data
        }
    }
    importAccount() {
        Actions.importAccount();
    }
    render() {
        return (
            <View style={{
                alignSelf: 'center'
            }}>
                <Text style={{ fontSize: 30 }}>
                    The Food Store
                </Text>
                <Image
                    source={require('../AppAssets/foodstore.png')}
                    style={{
                        resizeMode: 'contain',
                        width: 130,
                        alignSelf: 'center'
                    }}
                />
                <View>
                    <Button text="Create Account" onPress={this.createAccount.bind(this)} />
                </View>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text="Import Account" onPress={this.importAccount.bind(this)} />
                </View>
            </View>
        )
    }
}

export default Login;