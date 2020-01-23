import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View, Animated, Dimensions, Button
} from 'react-native';
// import { FloatingAction } from 'react-native-floating-action';
// import img2 from '../AppAssets/timer.png';

export default class App extends Component<{}> {
    constructor() {
        super();
        this.animatedValue = new Animated.Value(0);
    }
    state = {
        toColor: '#43A722',
        fromColor: '#ffffff',
        buttonText: 'Stop',
        running: true
    }

    getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    animateBackgroundColor = () => {
        if (this.state.running) {
            this.animatedValue.setValue(0);
            Animated.timing(
                this.animatedValue,
                {
                    toValue: 1,
                    duration: 1000
                }
            ).start(() => {
                this.swapColors();
                // console.log(this.state);
                this.animateBackgroundColor()
            });
        }
    }

    swapColors() {
        this.setState({
            fromColor: this.state.toColor,
            toColor: this.getRandomColor()
        })
    }

    swapTimer() {
        this.setState({
            running: !this.state.running
        })
    }

    componentDidMount() {
        this.animateBackgroundColor();
    }
    componentWillUnmount(){
        this.setState({
            running: false
        })
    }
    render() {
        const backgroundColorVar = this.animatedValue.interpolate(
            {
                inputRange: [0, 1],
                outputRange: [this.state.fromColor, this.state.toColor]
            });
        return (
            <Animated.View style={[styles.container, { backgroundColor: backgroundColorVar }]}>
                {/* <Text style={styles.text}>Animated </Text> */}
            </Animated.View>
        );

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        // position:'absolute'
    },
    text: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});