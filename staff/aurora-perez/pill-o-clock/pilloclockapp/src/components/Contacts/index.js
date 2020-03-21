import React, {useState} from 'react'
import { View, Text, ScrollView, Image, Button, TouchableOpacity, FlatList} from 'react-native'
import {List, ListItem } from 'react-native-elements'
import styles from './styles'

function Contacts ({toAdd, onContact, contacts}) {

    return (<>
        
        <ScrollView >
            <View style={styles.container}>
                <View style ={styles.titleContainer}>
                    <View style={styles.titleLeft}>
                        <Text style={styles.titleText}>My Contacts</Text>
                    </View>
                    <View style={styles.titleRight}>
                        <Image style={styles.logo} source={require('../../../assets/images/contacts.png')}/>
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
                                    const {name, surname, phone, id} = item
                                    
                                    onContact({name, surname, phone, id})
                                }}
                                title ={item.name.toString() }
                                titleStyle = {{
                                    marginTop : 20,
                                    fontSize : 25,
                                    color : '#fffdf9',
                                    alignSelf : 'center',
                                    backgroundColor : '#297885',
                                    padding : 15,
                                    borderRadius : 10,
                                    overflow: 'hidden',
                                    fontFamily : 'Sensei-Medium'
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
            </View>
        </ScrollView>
        
        
    </>)
}

export default Contacts