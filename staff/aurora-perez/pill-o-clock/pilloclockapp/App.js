import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Alert,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import {Notifications} from 'react-native-notifications';
import pushNotification from './pushNotifications';
import moment from 'moment';
import PushNotificationAndroid from 'react-native-push-notification';

import {
  Register,
  Login,
  LandingPatient,
  LandingPharmacist,
  Medication,
  AddMedication,
  DrugDetail,
  NavigationBarTop,
  Progress,
  Contacts,
  AddContacts,
  Patients,
  AddPatient,
  ContactDetail,
  PatientDetail
} from './src/components'

import logic, {
  registerUser,
  login,
  retrieveUser,
  retrieveMedication,
  addMedication,
  retrieveDrug,
  deleteMedication,
  retrieveContacts,
  retrieveDrugs,
  retrieveProgress,
  isLoggedIn
} from './src/logic'

import config from './config'

logic.__context__.API_URL = config.REACT_APP_API_URL

logic.__context__.storage = AsyncStorage

console.disableYellowBox = true

function App() {
  const [view, setView] = useState('login')
  const [error, setError] = useState(null)
  const [user, setUser] = useState()
  const [medication, setMedication] = useState()
  const [drugDetail, setDrugDetail] = useState()
  const [times, setTimes] = useState()
  const [goLanding, setGoLanding] = useState(false)
  const [contacts, setContacts] = useState()
  const [contactData, setContactData] = useState()
  const [schedule, setSchedule] = useState()
  const [drugs, setDrugs] = useState()
  const [progress, setProgress] = useState()
  const [patient, setPatient] = useState()

  useEffect(()=>{
    try{
      (async()=>{
        if(await isLoggedIn()) {
          const user = await retrieveUser()
          if (user.profile === 'pharmacist') {
              setUser(user)

              setGoLanding(true)

              setView('landingPharmacist')
          } else if (user.profile === 'patient') {
              setUser(user)
              setGoLanding(true)
              setView('landingPatient')

            } else {
              setView('login')
            }
          
        }
      })()

    }catch({message}){
      console.log(message)
    }
  }, [])

  useEffect(() => {
    //if(user) {
    const interval = setInterval(async () => {
      let alarms = await AsyncStorage.getItem('alarms')
      console.log(alarms)

      if (alarms) {
        alarms = JSON.parse(alarms)

        let date = AsyncStorage.getItem('date');
        date && (date = moment(date).format('YYYYMMDD'))
        !date && (await AsyncStorage.setItem('date', (date = moment().local().format('YYYYMMDD'))))


        let now = moment(new Date()).local().format('YYYYMMDD')

        if (now > date) {
          await AsyncStorage.setItem('date', now);

          for (const drug in alarms) {
            for (const time in alarms[drug]) {
              alarms[drug][time] = false
            }
          }
          await AsyncStorage.setItem('alarms', JSON.stringify(alarms))
        }

        
        for (const drug in alarms) {
          for (const time in alarms[drug]) {
            let nowHour = moment.utc(new Date).local().format('HHmm')

            const drugInfo = await retrieveDrug(drug)

            const {drugName} = drugInfo

            const sounded = alarms[drug][time]

            if (!sounded && nowHour >= time) {
              alarms[drug][time] = true
              console.log('alarms')

              await AsyncStorage.setItem('alarms', JSON.stringify(alarms))

              pushNotification.localNotification(drugName)
            }
          }
        }
      }
    }, 60000);

    return () => clearInterval(interval)
  }, []);

  pushNotification.configure()

  function __handleError__(message) {
    setError(message)
    setTimeout(() => {
      setError(null);
    }, 5000);
  }

  async function handleRegister({ name, surname, gender, age, phone, profile, email, password }) {
    try {
      await registerUser( name, surname, gender, age, phone, profile, email, password)
      setView('login')
    } catch ({message}) {
      __handleError__(message)
    }
  }

  async function handleToLogin() {
    await logic.__context__.storage.clear()
    setError(null)
    setGoLanding(false)
    setView('login')
  }

  async function handleLogin({email, password}) {
    try {
      await login(email, password)
      const loggedUser = await retrieveUser()

      if (loggedUser.profile === 'pharmacist') {
        setUser(loggedUser)

        setGoLanding(true)

        setView('landingPharmacist')
      } else if (loggedUser.profile === 'patient') {
        setUser(loggedUser)
        setGoLanding(true)
        setView('landingPatient')

      } else {
        setView('login')
      }
    } catch ({message}) {
      __handleError__(message)
    }
  }

  function handleToRegister() {
    setError(null)
    setView('register')
  }

  async function handleToMedication() {
    try {
      const _medication = await retrieveMedication()

      let alarms = await AsyncStorage.getItem('alarms')

      if(alarms) {(alarms = JSON.parse(alarms))
      }else{ alarms = {} }

      _medication.forEach(medication => {
        const currAlarms = alarms[medication.drug._id] || {}

        const newAlarms = {}

        medication.times.forEach(hour => {
          newAlarms[hour] = currAlarms[hour] || false
        })

        alarms[medication.drug._id] = newAlarms
      })
     // console.log(alarms+ ' when retrieve medic')

      await AsyncStorage.setItem('alarms', JSON.stringify(alarms))

      setMedication(_medication)
      setView('medication')
    } catch ({message}) {
      __handleError__(message)
    }
  }

  async function handleToAdd() {
    const drugs = await retrieveDrugs()
    setDrugs(drugs)
    setView('addMedication')
  }

  async function handleAddMedication(info) {
    const {drug} = info

    try {
      //TODO refactor
      delete info.drug;
      let keys = Object.keys(info);

      for (const key in info) {
        if (key.includes('hour') && !isNaN(info[key]) && info[key] > 24)
          throw new Error('Please, introduce a correct hour')
        if (key.includes('min') && !isNaN(info[key]) && info[key] > 59)
          throw new Error('Please, introduce a correct minutes')
      }

      const times = []

      for (let i = 1; i < keys.length / 2 + 1; i++) {
        times.push(`${info[`hour${i}`]}` + `${info[`min${i}`]}`);
      }

      await addMedication(drug, times)
      handleToMedication()
    } catch ({message}) {
      __handleError__(message)
    }
  }

  async function handleToDrug({id, times}) {
    try {
      
      const _drugDetail = await retrieveDrug(id)
      const {drugName} = _drugDetail
      //pushNotification.localNotification(drugName)

      setTimes(times)

      setDrugDetail(_drugDetail)

      setView('drugDetail')
    } catch ({message}) {
      __handleError__(message)
    }
  }

  async function handleToDeleteMedication({id}) {
    try {
      await deleteMedication(id)

      const _medication = await retrieveMedication()

      let alarms = await AsyncStorage.getItem('alarms')
      alarms && (alarms = JSON.parse(alarms))

      delete alarms[id]

      await AsyncStorage.setItem('alarms', JSON.stringify(alarms))

      handleToMedication()
    } catch ({message}) {
      console.log(message)
    }
  }

  async function handleToProgress() {
    try {
      const _progress = await retrieveProgress()

      setProgress(_progress)

      setView('progress')
    } catch ({message}) {
      __handleError__(message)
    }
  }

  async function handleToContacts() {
    try {
      const _contacts = await retrieveContacts()
      setContacts(_contacts)
      setView('contacts')

    } catch ({message}) {
      __handleError__(message)
    }
  }

  function handleToAddContacts() {
    setView('addContacts')
  }

  async function handleToPatients() {
    try {
      const _contacts = await retrieveContacts()
      setContacts(_contacts)
      setView('patients')

    } catch ({message}) {
      __handleError__(message)
    }
  }

  function handleToAddPatients() {
    setView('addPatients')
  }
  function handleToContactDetail({name, surname, phone, email}) {
    setContactData({name, surname, phone, email})
    setView('contactDetail')
  }

  function handleToPatientDetail(patient){
    setPatient(patient)
    setView('patientDetail')

  }

  return (
    <View style={styles.container}> 
        {goLanding && (<NavigationBarTop style={styles.navbar} toLogin={handleToLogin} toMedication={handleToMedication} toContacts={handleToContacts} toProgress={handleToProgress} toPatients={handleToPatients} user={user}/>)}

      <ScrollView style={styles.content}>
        {view === 'register' && ( <Register onSubmit={handleRegister} onToLogin={handleToLogin} error={error}/>)}
        {view === 'login' && ( <Login onSubmit={handleLogin} toRegister={handleToRegister} error={error} />)}
        {view === 'landingPatient' && ( <LandingPatient user={user} toMedication={handleToMedication} toProgress={handleToProgress} toContacts={handleToContacts}/>)}
        {view === 'landingPharmacist' && ( <LandingPharmacist user={user} toPatients={handleToPatients} />)}
        {view === 'medication' && (<Medication medication={medication} toAdd={handleToAdd} onDrug={handleToDrug} /> )}
        {view === 'addMedication' && (<AddMedication drugs={drugs} onSubmit={handleAddMedication} error={error} />)}
        {view === 'drugDetail' && (<DrugDetail drugDetail={drugDetail} times={times} toDelete={handleToDeleteMedication} />)}
        {view === 'contacts' && ( <Contacts contacts={contacts} toAdd={handleToAddContacts} onContact={handleToContactDetail}/>)}
        {view === 'progress' && <Progress progress={progress} user={user}/>}
        {view === 'addContacts' && <AddContacts />}
        {view === 'patients' && ( <Patients contacts={contacts} toAdd={handleToAddPatients} onPatient={handleToPatientDetail}/>)}
        {view === 'addPatients' && <AddPatient user={user} />}
        {view === 'contactDetail' && (<ContactDetail contactData={contactData} /> )}
        {view === 'patientDetail' && (<PatientDetail patient={patient} />)  }
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#beebe9',
  },

  title: {
    fontSize: 40,
  },
  content: {
    flex: 1,
  },
  navbar: {
    flex: 1,
  },
});

export default App;
