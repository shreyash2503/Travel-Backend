import firebase from "firebase/compat/app";
import config from "config";

const db = firebase.initializeApp(config.get<Object>("FIREBASE_CONFIG"));

export default db;
