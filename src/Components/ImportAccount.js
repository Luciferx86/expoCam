import React, { Component } from 'react';
import ReactNative, { View, Text, TextInput, AsyncStorage } from 'react-native';
import Input from './CustomInput';
import Button from './MyButton';
const ethers = require('ethers');
import { Actions } from 'react-native-router-flux';
import firebase from 'firebase';
import LoadingOverlay from 'react-native-orientation-loading-overlay';

class ImportAccount extends Component {
    state = {
        textValue: '',
        allUsers: [],
        allEmails: [],
        loading: true
    }

    loadUsers() {
        let allUsers = [];
        let allEmails = [];
        firebase.database().ref('Users/').once('value', (snapshot) => {
            snapshot.forEach((childSnapshot) => {
                allUsers.push(childSnapshot.key);
                allEmails.push(childSnapshot.child('Email').val());
            })
        }).then(() => {
            console.log(allUsers);
            console.log(allEmails);
            this.setState({
                allUsers,
                allEmails,
                loading: false
            });
        })
    }

    componentDidMount() {
        this.loadUsers();
    }

    getEmailFromAddress(address) {
        let email = '';
        const index = this.state.allUsers.indexOf(address);
        email = this.state.allEmails[index];
        return email;
    }

    async checkAccountExists() {
        try {
            const mnemonic = this.state.textValue;
            const wallet = ethers.Wallet.fromMnemonic(mnemonic);
            const address = wallet.address;
            const allUsers = this.state.allUsers;
            if (allUsers.includes(address)) {
                return true;
            } else {
                return false;
            }
        } catch (err) {

            console.log(err);
        }
    }


    async importAccount() {
        let wallet;
        if (this.checkAccountExists()) {
            try {
                wallet = ethers.Wallet.fromMnemonic(this.state.textValue);
                alert("Account Imported");
                try {
                    const email = this.getEmailFromAddress(wallet.address);
                    console.log('collected email', email);
                    await AsyncStorage.setItem('wallet', wallet.mnemonic);
                    await AsyncStorage.setItem('email',email);
                    Actions.reset('dashboard');
                } catch (error) {
                    // Error saving data
                }
                // Actions.dashboard({ wallet });
            } catch (err) {
                console.log(err);
                alert("Invalid Mnemonic");
            }
        } else {
            alert('User doesn\'t exists');
        }
        // console.log(wallet.address);}
    }
    render() {
        return (
            <View style={{
                alignContent: 'center'
            }} >
                <LoadingOverlay
                    visible={this.state.loading}
                    color="white"
                    indicatorSize="large"
                    messageFontSize={24}
                    message='Loading Users..'
                />

                <Text style={{
                    fontSize: 20, alignSelf: 'center', marginTop: 20
                }}>Enter 12 word mnemonic phrase:</Text>
                <View style={{
                    marginTop: 30
                }}>
                    <Input
                        icon='lock'
                        placeHolder='Mnemonic'
                        onChangeText={(text) => {
                            this.setState({ textValue: text });
                        }}
                    />
                </View>
                <View style={{
                    marginTop: 30
                }}>
                    <Button text='Import Account' onPress={this.importAccount.bind(this)} />
                </View>

            </View >
        )
    }
}

export default ImportAccount;