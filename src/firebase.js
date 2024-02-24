// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';



// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDidNIaFsfg30DHLob6UpFdX6sNwvMZ4Ug",
  authDomain: "iot-7bcaa.firebaseapp.com",
  databaseURL: "https://iot-7bcaa-default-rtdb.firebaseio.com",
  projectId: "iot-7bcaa",
  storageBucket: "iot-7bcaa.appspot.com",
  messagingSenderId: "756376470628",
  appId: "1:756376470628:web:27d60c1df28e5069d00b71",
  measurementId: "G-SRN3RG2JRR"
};
//firebase_compat_app__WEBPACK_IMPORTED_MODULE_0__.default.database is not a function
// TypeError: firebase_compat_app__WEBPACK_IMPORTED_MODULE_0__.default.database is not a function
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);


