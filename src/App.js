import React, { Component } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import './App.css';
import EventForm from './EventForm';
import AppBar from './AppBar';
import config from './firebaseConfig';
import InvalidUser from './InvalidUser';
import * as firebaseui from 'firebaseui'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { Typography, Grid } from '@material-ui/core';


var uiConfig = {
  // signInSuccessUrl: 'index.html',
  signInFlow: 'popup',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID
  ],
  callbacks: {
    // Avoid redirects after sign-in.
    signInSuccessWithAuthResult: () => false
  }
};


firebase.initializeApp(config);
const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      cities: [],
      isSignedIn: false,
      validUser: false
    }

    db.collection('cities').get().then((querySnapshot) => {
      const cities = []

      querySnapshot.forEach((doc) => {
          cities.push(doc.data())
      });
      cities.sort((a,b) => a.startDate > b.startDate);
      return cities;
    }).then(cities => this.setState({cities}))
  }

  userIsValid(user) {
    if (!!!user) {
      this.setState({validUser: false});
      return;
    }

    db.collection('moderators')
      .where("email", "==", user.email)
      .get()
      // .then(doc => console.log(doc));
      .then(doc => !doc.empty && this.setState({validUser: true}));
  }

  // Listen to the Firebase Auth state and set the local state.
  componentDidMount = () => {
    this.unregisterAuthObserver = firebase.auth().onAuthStateChanged(
        (user) => {
          this.setState({isSignedIn: !!user, user})
          this.userIsValid(user);
          }
    );
  }

  getComponent = () => {
    const {isSignedIn, validUser} = this.state;
    if (!isSignedIn) {
      return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    }

    if (validUser) {
      return <EventForm db={db} cities={this.state.cities}/>
    }

    return <InvalidUser />
  }

  render() {
    return (
      <div className="App">
      <AppBar firebase={firebase} isSignedIn={this.state.isSignedIn}/>
      <Grid container
        alignItems="center"
        direction="row"
        justify="center"
        
      >
        {this.getComponent()}
      </Grid>
      </div>
    );
  }
}

export default App;
