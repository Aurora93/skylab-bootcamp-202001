import React from 'react'
import styles from './styles'
import { Platform, View, Text, Linking, TextInput, ScrollView, Image, Button, TouchableOpacity} from 'react-native'

function ContactDetail ({contactData}){
    let {name, surname, phone} = contactData

    makeCall=()=>{
        let phoneNumber =''
        if(Platform.OS === 'android'){
            phoneNumber =`tel:${phone}`
        }else{
            phoneNumber= `telprompt:${phone}`
        }
        Linking.openURL(phoneNumber)
    }

    return (
        <View style = {styles.container}>
            <Text style = {styles.header}>Name: </Text>
            <Text style ={styles.text}>{name}</Text>

            <Text style ={styles.header}>Surname: </Text> 
            <Text style ={styles.text}>{surname}</Text>

            <Text style ={styles.header}>Number phone: </Text> 
            <Text style={styles.text} onPress={makeCall}>{phone}</Text>
            
        </View>
    )
}
export default ContactDetail