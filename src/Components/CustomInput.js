import React from 'react';
import ReactNative, { View } from 'react-native';

import MaterialsIcon from 'react-native-vector-icons/FontAwesome';
import { Kohana } from 'react-native-textinput-effects';
const Kohona = (props) => {
    return (
        <View style={{
            height: 60,
            borderWidth: 2,
            borderColor: '#0f3766',
            marginLeft: 30,
            marginRight: 30
        }}>
            <Kohana
                onChangeText={props.onChangeText}
                style={{ backgroundColor: '#b4dce4' }}
                label={props.placeHolder}
                iconClass={MaterialsIcon}
                iconName={props.icon}
                iconColor={'#3366ff'}
                iconSize={20}
                labelStyle={{ marginTop: 0, color: '#3366ff' }}
                inputStyle={{ color: '#019829' }}
                useNativeDriver
            />
        </View>
    )
}

export default Kohona;