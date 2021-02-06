import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
import firebase from 'firebase'
import db from '../config'

export default class NoficiationScreen extends React.Component{
    constructor(){
        super();
        this.state = {
            userId: firebase.auth().currentUser.email,
            allNotifications: []
        }
        this.notificationRef = null;
    }

    getNotifications = () => {
        this.requestRef = db.collection("all_notifications").where("notification_status", '==', "unread").where("targeted_user_id", '==', this.state.userId).onSnapshot((snapshot) => {
            var allNotifications = []
            snapshot.docs.map((doc) => {
                var notification = doc.data()
                notification["doc_id"] = doc.id
                allNotifications.push(notification)
            })
            this.setState({
                allNotifications: allNotifications
            })
        })
    }

    componentDidMount(){
        this.getNotifications();
    }

    keyExtractor = (item, index) => index.toString()
    renderItem = ({item, i}) =>{
        return(
          <ListItem
            key = {i}
            bottomDivider
          >
            <ListItem.Content>
                {<Icon name = 'book' 
                       color = 'black'
                />}
              <ListItem.Title
                style = {{ color: 'black', fontWeight: 'bold' }}
            >
                {item.book_name}
            </ListItem.Title>

            <ListItem.Subtitle
              style = {{color: 'green'}}
            >
              {item.message}
            </ListItem.Subtitle>
          </ListItem.Content>
          </ListItem>
        )
      }

    render(){
        return(
            <View>
                <View>
                    { this.state.allNotifications.length === 0
                       ? (
                           <View style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                               <Text style = {{fontSize: 25,}}>
                                    You have no notifications.
                               </Text>
                           </View>
                       ) : (
                            <FlatList
                                keyExtractor = {this.keyExtractor}
                                data = {this.state.allNotifications}
                                renderItem = {this.renderItem}
                            />
                       )
                    }
                </View>
            </View>
        )
    }
}