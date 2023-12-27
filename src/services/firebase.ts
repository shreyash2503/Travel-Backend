import config from "config";
import * as firebase from "firebase/app";

export default firebase.initializeApp(config.get("FIREBASE_CONFIG"));
