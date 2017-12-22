import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyBi3ZzMGT63HMsKZAbT_L8tteP3DEIoe2Q",
  authDomain: "lazyhodler-dev.firebaseapp.com",
  databaseURL: "https://lazyhodler-dev.firebaseio.com",
  projectId: "lazyhodler-dev",
  storageBucket: "lazyhodler-dev.appspot.com",
  messagingSenderId: "129852183346"
};

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const firebaseDb = firebase.database()
export const firebaseAuth = firebase.auth