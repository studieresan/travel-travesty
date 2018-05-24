import React, { Component } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import logo from './logo.svg';
import './App.css';
import EventForm from './EventForm';
import AppBar from './AppBar';
import config from './firebaseConfig';

firebase.initializeApp(config);

const db = firebase.firestore();
const settings = {timestampsInSnapshots: true};

db.settings(settings);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      cities: []
    }

    db.collection('cities').get().then((querySnapshot) => {
      const cities = []

      querySnapshot.forEach((doc) => {
          console.log(`${doc.id} => ${doc.data().name}`);
          cities.push(doc.data())
      });
      cities.sort((a,b) => a.startDate > b.startDate);
      return cities;
    }).then(cities => this.setState({cities}))
  }

  render() {
    return (
      <div className="App">
      <AppBar />
      <EventForm db={db} cities={this.state.cities}/>
      </div>
    );
  }
}

export default App;
