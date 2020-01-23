import React from 'react';
import ReactNative, { View, Text, TouchableOpacity, Image } from 'react-native';
const acceptbtn = require('../AppAssets/acceptbtn.png');
const rejectbtn = require('../AppAssets/rejectbtn.png');

const NewButton = (props) => {
    return (
        <TouchableOpacity onPress={props.onPress}>
            <Image
                style={{ alignSelf: "center" }}
                source={props.img}
            />
            <Text style={{
                position: 'absolute',
                marginTop: 10,
                alignSelf: 'center',
                fontSize: 20,
                color: 'white'
            }}>{props.text}</Text>

        </TouchableOpacity>
    )
}

const B = (props) => <Text style={{ fontWeight: 'bold' }}>{props.children}</Text>

const SingleRequest = (props) => {
    const object = props.obj;
    console.log(object);
    console.log(props);
    return (
        <View style={{
            borderWidth: 3,
            backgroundColor: '#a0ccf4',
            borderRadius: 8,
            alignItems: 'center'
        }}>
            <View style={{
                alignItems: 'center',
                margin: 20
            }}>
                <Text style={{
                    fontSize: 18
                }}><B>{object.Date}</B></Text>
                <Text style={{
                    fontSize: 22, marginTop: 10
                }}><B>File</B>: {object.File}</Text>
                <Text style={{
                    fontSize: 22, marginTop: 10
                }}><B>Signature</B>: {object.Signature}</Text>
                <Text style={{
                    fontSize: 22, marginTop: 10
                }}><B>Sender:</B> {object.Sender}</Text>
            </View>
            <View style={{
                flexDirection: 'row',
                alignSelf: 'center',
                marginTop: 20,
                marginBottom: 20
            }}>
                <NewButton text='Accept' img={acceptbtn} onPress = {props.onAccept}/>
                <View style={{ width: 50 }}></View>
                <NewButton text='Reject' img={rejectbtn} onPress = {props.onReject}/>
            </View>
        </View>
    )
}

export default SingleRequest;

{/* <Image
                style={{ alignSelf: "center", overlayColor: 'green' }}
            // source={btnBg}

            /> */}