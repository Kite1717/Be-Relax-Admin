import * as firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";
import "firebase/auth"

//yedek
// const firebaseConfig = {
//     apiKey: "AIzaSyDG0cDAiuu-O5lRUPaNHk2AxVZrZt4nbHY",
//     authDomain: "be-relax-app.firebaseapp.com",
//     databaseURL: "https://be-relax-app.firebaseio.com",
//     projectId: "be-relax-app",
//     storageBucket: "be-relax-app.appspot.com",
//     messagingSenderId: "62249513020",
//     appId: "1:62249513020:web:7a8fdfba8b66b454639339"
//   };

//orjinal
const firebaseConfig = {
  apiKey: "AIzaSyDrM_2AIA91Mj0LBSed1EzkBlbpDWhDTqY",
  authDomain: "be-relax-6a5cc.firebaseapp.com",
  databaseURL: "https://be-relax-6a5cc.firebaseio.com",
  projectId: "be-relax-6a5cc",
  storageBucket: "be-relax-6a5cc.appspot.com",
  messagingSenderId: "888124383819",
  appId: "1:888124383819:web:7beedcf2aacdf05a9963ce"
};

firebase.initializeApp(firebaseConfig);

export const storage = firebase.storage();
export const firestore = firebase.firestore();
export const auth = firebase.auth();

