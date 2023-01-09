import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import "firebase/database";


const firebaseConfig = {

    apiKey: "AIzaSyAdaKu_6IvFvhcvb6ApdBWST1VKcoeaPWk",

    authDomain: "fir-auth-d0253.firebaseapp.com",

    projectId: "fir-auth-d0253",

    storageBucket: "fir-auth-d0253.appspot.com",

    messagingSenderId: "805686066755",

    appId: "1:805686066755:web:ac7da591874a8a84641ef6",

    databaseURL: "https://fir-auth-d0253-default-rtdb.europe-west1.firebasedatabase.app"

};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}
const db = firebase.database();
const auth = firebase.auth()

export {
    auth,
    db
};