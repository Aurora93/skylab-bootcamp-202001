import React, {useState, useEffect} from 'react'
import { Text, View, StyleSheet, Alert } from 'react-native'

import { Register, Login, LandingPatient, LandingPharmacist, Medication, AddMedication, DrugDetail } from './src/components'
import { registerUser, login, retrieveUser, retrieveMedication, addMedication, retrieveDrug, deleteMedication } from './src/logic'
//import Header from '../Header

export default function App () {
  const [view, setView] = useState('login')
  const [error, setError] = useState(null) 
  const [user, setUser] = useState()
  const [ token, setToken ] = useState()
  const [ medication, setMedication] = useState()
  const [ drugDetail, setDrugDetail ] =useState()
  const [ times, setTimes ] = useState()


  function __handleError__(message) {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, 5000)
  }

  async function handleRegister ({name, surname, gender, age, phone, profile, email, password}) {
    try {
      await registerUser(name, surname, gender, age, phone, profile, email, password)
      setView('login')

    }catch({message}){
      __handleError__(message)
    }
  }

  function handleToLogin (){
    setError(null)
    setView('login')
  }

  async function handleLogin ({email, password}){
    try {
      const _token = await login(email, password)
      const loggedUser = await retrieveUser(_token)

      if(loggedUser.profile === 'pharmacist') {
        setToken (_token)

        setUser(loggedUser)

        setView('landingPharmacist')

      }else if (loggedUser.profile === 'patient'){
        setToken (_token)

        setUser(loggedUser)
        setView('landingPatient')
      } else{
        //TODO
      }

    }catch({message}){
      __handleError__(message)
    }
  }

  function handleToRegister () {
    setError(null)
    setView('register')
  }

  async function handleToMedication () {
    try{
      const _medication = await retrieveMedication(token)
      setMedication(_medication)
      setView('medication')

    }catch({message}){
      __handleError__(message)
    }
  }

  function handleToAdd () {
    setView('addMedication')
  }

  async function handleAddMedication (info) {
    
    try{
      const {drug} = info
      let keys = Object.keys(info)
      keys.slice(0,1)

      for (const key in info){
        if (key !=='drug') {
          if (key.includes('hour') && !isNaN(info[key]) && info[key]>24) throw new Error('Please, introduce a correct hour')
          if (key.includes('min') && !isNaN(info[key]) && info[key]>59) throw new Error('Please, introduce a correct hour')
        }
      }

      const times = []

      for (let i = 1; i < keys.length/2; i++) {
          times.push(parseInt(`${info[`hour${i}`]}${info[`min${i}`]}`))
      }

      await addMedication(token, drug, times)
      
      handleToMedication()

    }catch({message}){
      __handleError__(message)
    }
  }

  async function handleToDrug ({drugName, times}){
    try {
      const _drugDetail = await retrieveDrug(drugName)

      setTimes(times)

      setDrugDetail(_drugDetail)

      setView('drugDetail')

    }catch({message}){
      __handleError__(message)
    }
  }

  async function handleToDeleteMedication ({id}) {
    try {
      await deleteMedication(token, id)
      handleToMedication()

    }catch({message}){

    }
  }



  return(<View style={styles.container}>
    { view === 'register' && <Register onSubmit = {handleRegister} onToLogin = {handleToLogin} error= {error}/> }
    { view === 'login' && <Login onSubmit = {handleLogin} toRegister = {handleToRegister} error= {error}/> }
    { view === 'landingPatient' && <LandingPatient user={user} toMedication={handleToMedication}  /> }
    { view === 'landingPharmacist' && <LandingPharmacist user={user} /> }
    { view === 'medication' && <Medication medication = {medication} toAdd={handleToAdd} onDrug={handleToDrug}/> }
    { view === 'addMedication' && <AddMedication onSubmit = {handleAddMedication} error = {error}/>}
    { view === 'drugDetail' && <DrugDetail drugDetail={drugDetail} times ={times} toDelete ={handleToDeleteMedication}/>}
    </View>
  //toProgress={handleToProgress} toContacts={handleToContacts} y en pharma toPatients = {handleToPatients}
  )
}

const styles = StyleSheet.create({
    container : {
        flex : 1,
        justifyContent : 'center',
        alignItems : 'center',
        backgroundColor : '#beebe9'
    },

    title : {
        fontSize : 40,
    }
})


