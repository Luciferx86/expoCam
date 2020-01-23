import React, { Component } from 'react';
import ReactNative, { View, Text } from 'react-native';
import Button from './MyButton';
import apiKey from './SendGridApi';
const SENDGRIDAPIKEY = apiKey;
const FROMEMAIL = "mekrtk@gmail.com";
const TOMEMAIL = "akshayarora.10.6.97@gmail.com";
const SUBJECT = "You have a new message";
import { sendGridEmail } from 'react-native-sendgrid'

class SendMail extends Component {

    sendMail() {
        const message = 'Hey this is akhsay and I wanted to know how is everything going.'

        const sendRequest = sendGridEmail(SENDGRIDAPIKEY, TOMEMAIL, FROMEMAIL, SUBJECT, message)
        sendRequest.then((response) => {
            console.log("Success", response)
        }).catch((error) => {
            console.log(error)
        });
    }
    render() {
        return (
            <View style={{
                marginTop: 40
            }}>
                <Button
                    text='Send Mail'
                    onPress={() => {
                        this.sendMail();
                    }} />
            </View>
        )
    }
}

export default SendMail;











