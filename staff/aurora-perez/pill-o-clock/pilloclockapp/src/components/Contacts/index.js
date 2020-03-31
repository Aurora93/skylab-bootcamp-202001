import React, {useState} from 'react'
import { View, Text, ScrollView, Image, Button, TouchableOpacity, FlatList} from 'react-native'
import {List, ListItem } from 'react-native-elements'
import styles from './styles'

function Contacts ({toAdd, onContact, contacts}) {

    return (<>
        
        <View style={styles.container}>
            <ScrollView >
                <View style ={styles.titleContainer}>
                    <View style={styles.titleLeft}>
                        <Text style={styles.titleText}>My Contacts</Text>
                    </View>
                    <View style={styles.titleRight}>
                        <Image style={styles.logo} source={require('../../../assets/images/contacts-color.png')}/>
                    </View>
                </View>
                {
                    contacts.length > 0 ? 
                    <FlatList 
                        style={styles.list}
                        data = {contacts}
                        renderItem={({item})=>(
                            <ListItem 
                                onPress ={()=> {
                                    const {name, surname, phone, email} = item
                                    
                                    onContact({name, surname, phone, email})
                                }}
                                title ={item.name.toString() }
                                titleStyle = {{
                                    marginTop : 20,
                                    fontSize : 35,
                                    color : '#fffdf9',
                                    alignSelf : 'center',
                                    backgroundColor : '#297885',
                                    padding : 15,
                                    borderRadius : 10,
                                    overflow: 'hidden',
                                    fontFamily : 'Chocolate_DRINK_DEMO'
                                }}
                            />
                        )}
                        keyExtractor={item => item.name}
                    />
                :
                    <Text style={styles.text}>You don't have contacts yet! Do you want to add one?</Text>
                
                }
                <TouchableOpacity onPress={()=>toAdd()}>
                    <Image style={styles.plus} source={require('../../../assets/images/plus.png')}/>
                </TouchableOpacity>
            </ScrollView>
        </View>
        
        
    </>)
}

export default Contacts