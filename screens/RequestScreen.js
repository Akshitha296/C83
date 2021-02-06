import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Alert, Image, Modal, ScrollView } from 'react-native';
import MyHeader from '../components/myHeader'
import db from '../config'
import firebase from 'firebase'

export default class RequestScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            bookName: '',
            reason: '',
            userId: firebase.auth().currentUser.email
        }
    }

    createUniqueId(){
        return(Math.random().toString(36).substring(7))
    }

    addRequest = (bookname, reasonforrequest) =>{
        var userId = this.state.userId
        var randomRequestId = this.createUniqueId()
        db.collection('requested_books').add({
            user_id: userId,
            book_name: bookname,
            reason_to_request: reasonforrequest,
            request_id: randomRequestId,
        })
        this.setState({
            bookName: '',
            reason: '',
        })
    }

    render(){
        return(
            <View style = {{flex: 1}}>
                <KeyboardAvoidingView style = {styles.keyboardStyle}>
                    <TextInput
                        style = {styles.formTextInput}
                        placeholder = "Book Name Here"
                        onChangeText = {(text) => {
                            this.setState({
                                bookName: text
                            })
                        }}
                        value = {this.state.bookName}
                    />

                    <TextInput
                        style = {[styles.formTextInput, {height: 300}]}
                        placeholder = "Reason for request"
                        onChangeText = {(text) => {
                            this.setState({
                                reason: text
                            })
                        }}
                        value = {this.state.reason}
                        multiline
                        numberOfLines = {8}
                    />

                    <TouchableOpacity style = {styles.requestButton} 
                                      onPress = {() =>{
                                          this.addRequest(this.state.bookName, this.state.reason)
                                      }}
                    >
                        <Text>
                            Request
                        </Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    keyboardStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    formTextInput: {
        width: '75%',
        height: 40,
        borderRadius: 3,
        borderColor: 'brown',
        alignSelf: 'center',
        marginTop: 20,
    }, 
    requestButton: {
        width: '75%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        borderRadius: 10,
        backgroundColor: 'green'
    }
})