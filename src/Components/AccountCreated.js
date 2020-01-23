import React, { Component } from 'react';
import ReactNative, { View, Text, Clipboard, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import Button from './MyButton';
import { Actions } from 'react-native-router-flux';
const ethers = require('ethers');
import Input from './CustomInput';
import firebase from 'firebase';
const validator = require("email-validator");

class AccountCreated extends Component {

    state = {
        email: ''
    }
    copyMnemonic() {
        Clipboard.setString(this.props.wallet.mnemonic);
    }

    linkEmail() {
        if (validator.validate(this.state.email)) {
            firebase.database().ref('Users/').child(this.props.wallet.address).child('Email')
                .set(this.state.email).then(() => {
                    alert('Email has been linked and account is stored');
                    try {
                        AsyncStorage.setItem('wallet', this.props.wallet.mnemonic);
                        AsyncStorage.setItem('email', this.state.email);
                    } catch (err) {
                        console.log(err);
                    }
                    Actions.reset('dashboard');
                })
        } else {
            alert('Invalid Email Format');
        }
    }
    render() {
        const wallet = this.props.wallet;
        // const wallet = ethers.Wallet.createRandom();
        // console.log(this.props.wallet);
        return (
            // <View style={{
            //     alignSelf: 'center'
            // }}>
            <KeyboardAvoidingView
                style={{ alignSelf: 'center' }}
                behavior='position'
                enabled
                keyboardVerticalOffset={100}>
                <Text style={{
                    fontSize: 17, margin: 5
                }}>
                    A New Account has been creatd for you.
                </Text>
                <Text style={{
                    fontSize: 20, margin: 5, color: 'red'
                }}>
                    Keep these details in a safe place:
                </Text>
                <Text style={{
                    fontSize: 20, margin: 5
                }}>
                    Address: {wallet.address}
                </Text>
                <Text style={{
                    fontSize: 17, margin: 5
                }}>
                    Mnemonic:
                </Text>
                <Text style={{
                    fontSize: 22, margin: 5
                }}>{wallet.mnemonic}
                </Text>
                <View>
                    <Button text='Copy Mnemonic'
                        onPress={this.copyMnemonic.bind(this)} />
                </View>
                <View style={{
                    marginTop: 20
                }}>
                    <View style={{
                        // marginTop: 20,
                        // width: 80
                    }}>
                        <Input
                            icon='envelope'
                            placeHolder='Email'
                            onChangeText={(text) => {
                                this.setState({
                                    email: text
                                })
                                console.log(this.state);
                            }}
                        />
                    </View>
                    <View style={{
                        marginTop: 15
                    }}>
                        <Button text='Link With Email'
                            onPress={() => {
                                this.linkEmail();
                            }} />
                    </View>
                </View>
                {/* </View > */}
            </KeyboardAvoidingView>
        )

    }
}

export default AccountCreated;