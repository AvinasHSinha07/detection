import { initializeApp } from "firebase/app";
import { getAuth,  } from "firebase/auth";
import { getStorage } from "firebase/storage";

import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAdqJ28uvLYkKQrZe2kMxU_Ihuwy8flY74",

  authDomain: "wild-animal-detection-28089.firebaseapp.com",

  projectId: "wild-animal-detection-28089",

  storageBucket: "wild-animal-detection-28089.appspot.com",

  messagingSenderId: "409969280958",

  appId: "1:409969280958:web:c82d26a76bcec34e335bef",
  
  storageBucket: 'wild-animal-detection-28089.appspot.com',
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
