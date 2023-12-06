//<********************************************>
//LAST EDITED: 2023.12.04
//EDITED BY: ORBAN TAMAS
//DESCRIPTION: This file contains the firebase configuration.
//<********************************************>

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth,getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getStorage } from  'firebase/storage' ;

//Your web app's Firebase configuration
const firebaseConfig = {
   apiKey: "AIzaSyDxnSDGrMg7YyaUVdPk9czuWofUTvUzTs0",
   authDomain: "orcaapp-dfa9b.firebaseapp.com",
   databaseURL: "https://orcaapp-dfa9b-default-rtdb.europe-west1.firebasedatabase.app",
   projectId: "orcaapp-dfa9b",
   storageBucket: "orcaapp-dfa9b.appspot.com",
   messagingSenderId: "660408269329",
   appId: "1:660408269329:web:8ccb30d2417f262e2f4fb0"
};

//FIREBASE APP INIT
export const app = initializeApp(firebaseConfig);

//FIREBASE AUTH INIT
export const auth = initializeAuth(app, {
   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

//FIREBASE FIRESTORE INIT
export const db = getFirestore(app);

//FIREBASE STORAGE INIT
export const storage = getStorage();


