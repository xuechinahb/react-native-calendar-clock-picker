/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Modal
} from 'react-native';
import {CalendarList, LocaleConfig} from 'react-native-calendars';
import moment from 'moment';
import ClockPicker from './ClockPicker';
const mainColor = '#009688';
const calendarWidth = 260;
const locales = LocaleConfig.locales[""];
const months = locales.monthNamesShort;
const days = locales.dayNamesShort;

export default class App extends Component {

    constructor(props){
        super(props);
        this.state = {
            modalVisible: false,
            datePickerVisible: false,
            yearIndex: moment().year(),
            monthIndex: moment().month(),
            dayIndex: moment().day(),
            day: moment().date(),
            hour: moment().hour(),
            minute: moment().minute()

        };
        this.onDayPress = this.onDayPress.bind(this);
        this.switchModal = this.switchModal.bind(this);
        this.updateTime = this.updateTime.bind(this);

    }

    render() {
        const {hour, minute} = this.state;
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.switchModal(true)}>
                    <View style={styles.button}>
                        <Text>Show Calendar</Text>
                    </View>
                </TouchableOpacity>
                <Modal
                    visible={this.state.modalVisible}
                >
                    <View style={styles.container}>
                        <View style={styles.dateProfile}>
                            <Text style={styles.year}>{this.state.yearIndex}</Text>
                            <Text style={styles.date}>{days[this.state.dayIndex]}, {months[this.state.monthIndex]} {this.state.day}</Text>
                            <Text style={styles.time}>{hour < 10 ? `0${hour}` : hour === 24 ? '00' : hour} : {minute < 10 ? `0${minute}` : minute}</Text>
                        </View>
                        <View style={styles.calendarContainer}>
                            {
                                this.state.datePickerVisible ?
                                    <CalendarList
                                        pastScrollRange={24}
                                        futureScrollRange={24}
                                        horizontal
                                        pagingEnabled
                                        style={{
                                            width: calendarWidth,
                                        }}
                                        calendarWidth={calendarWidth}
                                        theme={{
                                            calendarBackground: '#F5FCFF',
                                            todayTextColor: mainColor,
                                        }}
                                        onDayPress={this.onDayPress}
                                        markedDates={{
                                            [this.state.selected]: {selected: true, selectedColor: mainColor},
                                        }}
                                    />:
                                    <ClockPicker
                                        hour={this.state.hour}
                                        minute={this.state.minute}
                                        callback={this.updateTime}
                                    />
                            }
                        </View>
                        <View style={styles.actionBar}>
                            <Text style={{color: mainColor}} onPress={() => this.switchModal(false)}>CANCEL</Text>
                            <Text style={{marginLeft: 20, color: mainColor}} onPress={() => this.switchModal(true, false)}>OK</Text>
                        </View>
                    </View>

                </Modal>

            </View>
        );
    }

    onDayPress(day) {
        let date = moment(day.timestamp);
        this.setState({
            selected: day.dateString,
            yearIndex: date.year(),
            monthIndex: date.month(),
            dayIndex: date.day(),
            day: date.date(),
        });
    }

    switchModal(modalVisible, datePickerVisible=true){
        this.setState({modalVisible, datePickerVisible});
    }

    updateTime({hour, minute}){
        if(hour !== undefined){
            this.setState({hour});
        }
        if(minute !== undefined){
            this.setState({minute});
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    button: {
      height: 45,
      width: 150,
      borderColor: mainColor,
      borderWidth: 1,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    calendarContainer: {
        height: calendarWidth,
        // width: calendarWidth,
        justifyContent: 'center',
        // alignItems: 'center',
    },
    actionBar: {
        marginTop: 30,
        flexDirection: 'row',
        width: calendarWidth,
        justifyContent: 'flex-end'

    },
    dateProfile: {
        width: calendarWidth,
        padding: 15,
        backgroundColor: mainColor
    },
    year: {
        color: '#9ed3ce'
    },
    date: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 23,
        marginTop: 10,
        marginBottom: 10
    },
    time: {
        color: '#fff',
        fontSize: 18,
    }
});
