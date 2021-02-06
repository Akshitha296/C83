import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase'
import db from '../config'

export default class MyDonationScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            allDonations: [],
        }
    }

    componentDidMount(){
        this.getAllDonations()
    }

    getAllDonations = () =>{
        console.log(this.state.userId)
        this.requestRef = db.collection('all_donations').where("donor_id", '==', this.state.userId).onSnapshot(
            (snapshot) => {
                var allDonations = snapshot.docs.map(document => document.data())
                console.log(allDonations)
                this.setState({
                    allDonations: allDonations
                })
            }
        )
        console.log(this.state.allDonations)
    }

    sendNotification = (bookDetails, requestStatus) => {
        var requestId = bookDetails.request_id
        var donorId = bookDetails.donor_id
        db.collection("all_notifications").where("request_id", '==' , requestId).where("donor_id" , '==', donorId).get().then(
            (snapshot) => {
                snapshot.forEach((doc) => {
                    var message = ""
                    if (requestStatus === "Book Sent"){
                        message = this.state.donorName + "Sent You A Book!"
                    } else {
                        message = this.state.donorName + "Has Shown Interest In Donating Your Book"
                    }
                    db.collection("all_notifications").doc(doc.id).update({
                        message: message,
                        notification_status: "unread",
                        date: firebase.firestore.FieldValue.serverTimestamp()
                    })
                })
            }
        )
    }

    sendBook = (bookDetails) => {
        if (bookDetails.request_status === "Book Not Sent"){
            var requestStatus = "Donor Interested"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: requestStatus
            })
            this.sendNotification(bookDetails, requestStatus);
        } else {
            var requestStatus = "Book Sent"
            db.collection("all_donations").doc(bookDetails.doc_id).update({
                request_status: requestStatus
            })
            this.sendNotification(bookDetails, requestStatus);
        }
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ({item, i}) =>{
        return(
          <ListItem
            key = {i}
            bottomDivider
          >
            <ListItem.Content>
              <ListItem.Title
                style = {{ color: 'black', fontWeight: 'bold' }}
            >
                {item.book_name}
            </ListItem.Title>

            <ListItem.Subtitle
              style = {{color: 'green'}}
            >
              {"Requested By: " + item.requested_by + '\n status: ' + item.request_status}
            </ListItem.Subtitle>

                {<Icon name = 'book' 
                   color = 'black'
                />}

                <TouchableOpacity style = {{width: 50, height: 20, color: 'red'}}
                                  onPress = {() => {
                                      this.sendBook(item);
                                  }}
                >
                    <Text style = {{fontSize: 5, fontStyle: 'bold', alignItems: 'center', justifyContent: 'center'}}>
                        Send Book
                    </Text>
                </TouchableOpacity>
          </ListItem.Content>

          </ListItem>
        )
      }

    render(){
        return(
            <View style = {{flex: 1,}}>
                <View style = {{flex: 1,}}>
                    {this.state.allDonations.length === 0 
                    ? (<View><Text>List Of Book Donations</Text></View>) 
                    : (<FlatList
                            keyExtractor = {this.keyExtractor}
                            data = {this.state.allDonations}
                            renderItem ={this.renderItem}
                      />)
                }
                </View>
            </View>
        )
    }
}