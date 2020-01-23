import React from 'react';
import ReactNative, { View, Text } from 'react-native';
import { ListItem } from 'react-native-elements'

const StoreItem = (props) => {
    console.log(props);
    return (
        <View style = {{
            borderWidth: 2
        }}>
            <ListItem
                key={props.fileName}
                leftAvatar={{ source: require('../AppAssets/fileicon.png') }}
                title={props.fileName}
                titleStyle = {{
                    fontSize: 20
                }}
                containerStyle = {{
                    backgroundColor: '#afbfe3'
                }}
                onPress = {props.onPress}
                rightTitle = {props.date}
            />
        </View>
    )
}

export default StoreItem;