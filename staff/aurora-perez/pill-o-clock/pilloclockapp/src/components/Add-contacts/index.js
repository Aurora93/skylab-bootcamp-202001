
import React, { Component } from 'react'
import styles from './styles'
import logic, { addContact } from '../../logic';

import { AppRegistry, StyleSheet, Text, TouchableOpacity, Alert} from 'react-native'

import QRCodeScanner from 'react-native-qrcode-scanner'

export default class ScanScreen extends Component {

  onSuccess (id) {
    (async () => {
      try{
        await addContact(id)
        Alert.alert('Contact added!')
      }catch({message}){
        console.log(message)
      }
    })()

    
    // Linking
    //   .openURL(e.data)
    //   .catch(err => console.error('An error occured', err))
  }

  render() {
    return (
      <QRCodeScanner
        onRead={(e) => this.onSuccess(e.data)}
        topContent={
          <Text style={styles.centerText}>
            Scan your pharmacist's QR code!
          </Text>
        }
        bottomContent={
          <TouchableOpacity style={styles.buttonTouchable}>
            <Text style={styles.buttonText}>OK. Got it!</Text>
          </TouchableOpacity>
        }
      />
    )
  }
}

AppRegistry.registerComponent('default', () => ScanScreen)
