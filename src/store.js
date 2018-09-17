import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";
import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";

import notifyReducer from "./reducers/notifyReducer";
import settingReducer from "./reducers/settingReducer";

const firebaseConfig = {
  apiKey: "AIzaSyD1ZbLzv1SgmRpO_0PbXZSV0RnogiuT3Og",
  authDomain: "reactclientpanel-3c61f.firebaseapp.com",
  databaseURL: "https://reactclientpanel-3c61f.firebaseio.com",
  projectId: "reactclientpanel-3c61f",
  storageBucket: "reactclientpanel-3c61f.appspot.com",
  messagingSenderId: "354674883986"
};

//react-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

//init firebase instance
firebase.initializeApp(firebaseConfig);

//Init firestore
const firestore = firebase.firestore();

const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer,
  settings: settingReducer
});

// Checking for the settings in local storage
if (localStorage.getItem("settings") == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  // set to local store
  localStorage.setItem("settings", JSON.stringify(defaultSettings));
}

// Create initial state
const initialState = { settings: JSON.parse(localStorage.getItem("settings")) };

// Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
