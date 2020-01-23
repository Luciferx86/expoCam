import React from 'react';
import ReactNative, { View, Text, TouchableOpacity, Image } from 'react-native';
const btnBg = require('../AppAssets/btnbg.png');

const MyButton = (props) => {
    return (
        <TouchableOpacity onPress = {props.onPress}>
            <Image
                style={{ alignSelf: "center" }}
                source={btnBg}
            />
            <Text style = {{
                position: 'absolute',
                marginTop: 10,
                alignSelf:'center',
                fontSize: 20,
                color: 'white'
            }}>{props.text}</Text>

        </TouchableOpacity>
    )

}

export default MyButton;