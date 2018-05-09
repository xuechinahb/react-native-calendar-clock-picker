/**
 * TimePicker
 * 04/05/2018
 * @flow
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    PanResponder
} from 'react-native';
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Symbol,
    Text,
    Use,
    Defs,
    Stop
} from 'react-native-svg';

const mainColor = '#009688';
export default class ClockPicker extends Component {

    static defaultProps = {
        militaryTime: true,
        radius: 115,//74.75
        size: 300
    };


    constructor(props){
        super(props);

        this.positionsHours = this.calculatePositionsHours();
        this.positionsMinutes = this.calculatePositionsMinutes();
        const {size, radius, hour, callback} = this.props;
        this.state = {
            hourMode: true,
            endX: this.positionsHours[hour - 1][0],
            endY: this.positionsHours[hour - 1][1]
        };

        this.centerX = size / 2;
        this.centerY = size / 2;
        this.radius = radius;
        this.size = size;
        this.callback = callback;
        this.panRelease = false;
        this.showMinutes = this.showMinutes.bind(this);
    }

    showMinutes(){
        if(this.panRelease && this.state.hourMode){
            const {minute} = this.props;
            this.setState({
                hourMode: false,
                endX: this.positionsMinutes[minute - 1][0],
                endY: this.positionsMinutes[minute - 1][1]
            })
        }
    }

    componentWillMount() {
        this._panResponder = PanResponder.create({

            onStartShouldSetPanResponder: (evt, gestureState) => true,
            onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
            onMoveShouldSetPanResponder: (evt, gestureState) => true,
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,

            onPanResponderGrant: (evt, gestureState) => {
                this.panRelease = false;
            },

            onPanResponderMove: (evt, gestureState) => {
                // const {locationX, locationY} = evt.nativeEvent;
                // this.setState({
                //     endX: locationX,
                //     endY: locationY
                // });
                this.calCoordinate(evt);
            },

            onPanResponderTerminationRequest: (evt, gestureState) =>  true,
            onPanResponderRelease: (evt, gestureState) => {
                this.calCoordinate(evt);
                this.panRelease = true;
                setTimeout(this.showMinutes, 1000);
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                return true;
            },
        });
    }

    calCoordinate(evt){
        const {hourMode} = this.state;
        const {locationX, locationY} = evt.nativeEvent;
        const disX = locationX - this.centerX;
        const disY = locationY - this.centerY;

        let amFlag = false;
        const length = Math.sqrt(disX * disX + disY * disY);
        // let rate = 1;
        if(length < 1){
            return;
        }else if(length < this.hourSmallRadius + 15){
            // rate =  this.hourSmallRadius / length;
            amFlag = true;
        }else{
            // rate =  this.radius / length;
            amFlag = false;
        }

        // Math.sin((index % 12 / 6 - 0.5) * Math.PI)
        let angle  = Math.abs(disY / length * 90) ;
        let tempIndex = 0;
        if(disX > 0){
            if(disY > 0){
                tempIndex = hourMode ? amFlag ? 2  : 14 : 15;
            }else{
                angle  = Math.abs(disX / length * 90) ;
                tempIndex = hourMode ? amFlag ? 0  : 12 : 0;
            }
        }else{
            if(disY > 0){
                angle  = Math.abs(disX / length * 90) ;
                tempIndex = hourMode ? amFlag ? 5  : 17 : 30;
            }else{
                tempIndex = hourMode ? amFlag ? 9  : 21 : 45;
            }
        }
        let num =  Math.floor(hourMode ? angle / 30 : angle / 6);
        const index = tempIndex + num;
        const endX = hourMode ? this.positionsHours[index][0] : this.positionsMinutes[index][0];
        const endY = hourMode ? this.positionsHours[index][1] : this.positionsMinutes[index][1];
        this.setState({
            endX,
            endY
        });
        this.callback(hourMode ? {hour: index + 1} : {minute: index});

    }

    render() {
        const {size,  radius, militaryTime}= this.props;

        const {hourMode, endX, endY} = this.state;
        return (
            <Svg height={size} width={size} marginTop={20}>
                <Circle {...this._panResponder.panHandlers}
                        cx={this.centerX}
                    cy={this.centerY}
                    r={radius + 16}
                    fill="#eee"
                />
                <G>
                    <Line x1={this.centerX} y1={this.centerY} x2={endX} y2={endY}
                          stroke={mainColor} strokeWidth={2}/>
                    <Circle cx={endX} cy={endY} r={15} fill={mainColor} />

                </G>
                {
                    hourMode ?
                        <G>
                            {this.renderHoursBubbles()}
                        </G> :
                        <G>
                            {this.renderMinutesBubbles()}
                        </G>
                }
            </Svg>
        );
    }

    renderHoursBubbles () {
        const bubbles = [];

        for (let index = 0; index < this.positionsHours.length; ++index) {
            const x = this.positionsHours[index][0];
            const y = this.positionsHours[index][1];

            const hour = (index + 1) % 24;
            bubbles.push(
                <G
                    key={index}
                >
                    <Circle cx={x} cy={y} r={15} fill={'none'} />

                    <Text x={x} y={y + 4} dominantBaseline={'middle'} textAnchor={'middle'} fontSize={13}>
                        {hour}
                    </Text>
                </G>
            );
        }

        return bubbles;
    }

    renderMinutesBubbles () {
        const bubbles = [];
        for (let minute = 0; minute < this.positionsMinutes.length; ) {
            const x = this.positionsMinutes[minute][0];
            const y = this.positionsMinutes[minute][1];
            bubbles.push(
                <G
                    key={minute}
                >
                    <Circle cx={x} cy={y} r={15} fill={'none'} />

                    <Text x={x} y={y + 4} dominantBaseline={'middle'} textAnchor={'middle'} fontSize={13}>
                        {minute}
                    </Text>
                </G>
            );
            minute += 5
        }

        return bubbles;
    }


    calculatePositionsHours () {
        const {militaryTime, radius, size} = this.props;

        const positions = [];

        for (let index = 1; index <= (militaryTime ? 24 : 12); ++index) {
            positions.push([
                (size / 2 + radius * (militaryTime ? index > 12 ? 1 : 0.65 : 1) * Math.cos((index % 12 / 6 - 0.5) * Math.PI)),
                (size / 2 + radius * (militaryTime ? index > 12 ? 1 : 0.65 : 1) * Math.sin((index % 12 / 6 - 0.5) * Math.PI))
            ]);
        }

        const temp = positions[2];
        this.hourSmallRadius = Math.sqrt(temp[0] * temp[0], temp[1] * temp[1]) - size / 2;
        return positions;
    }

    calculatePositionsMinutes () {
        const {radius, size} = this.props;
        const positions = [];

        for (let index = 0; index < 60; ++index) {
            positions.push([
                Math.round(size / 2 + radius * Math.cos((index / 30 - 0.5) * Math.PI)),
                Math.round(size / 2 + radius * Math.sin((index / 30 - 0.5) * Math.PI))
            ]);
        }

        return positions;
    }

}
