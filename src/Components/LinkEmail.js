import React, { Component } from 'react';
import ReactNative, { View, Text } from 'react-native';
import Input from './CustomInput';

class LinkEmail extends Component {
    render() {
        return (
            <View style={{
                alignSelf: 'auto'
            }}>
                <View style={{
                    marginTop: 30
                }}>
                    <Input
                        icon='lock'
                        placeHolder='Mnemonic'
                    />
                </View>
            </View>
        )
    }
}

export default LinkEmail;