//<********************************************>
//LAST EDITED DATE: 2023.12.04
//EDITED BY: Orban Tamas
//DESCRIPTION: Context for user authentication
//<********************************************>

//BASIC IMPORTS
import { useContext, createContext, useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/core";

//FIREBASE AUTH
import { AuthErrorCodes, createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword,sendEmailVerification  } from "firebase/auth";

//FIREBASE
import { auth,db} from "../firebase";
import { collection, doc, setDoc,getDoc} from "firebase/firestore";

//CREATE CONTEXT
const userContext = createContext();

//REFERENC TO ACCESS CODE
export const useAuth = () => { return useContext(userContext) }

const UserAuthContext = ({ children }) => {

//<********************VARIABLES************************>

//SET CURRENT USER WITH PROPER DATA
const [currentuser, setuser] = useState()

//ERROR HANDLING
const [error, setError] = useState("")

//PREMIUM STATE
const [isPremium,setIsPremium] = useState(false)

//USER DATA
const [userData, setUserData] = useState([]);

//NAVIGATION
const navigation = useNavigation();

//<********************FUNCTIONS************************>

//PREMUIM STATE TOGGLE
useEffect(() => {
  if(currentuser){
    const userRef= doc(db,"users",currentuser.uid)
    const newData ={
        id: userData.id,
        fullname: userData.fullname,
        email: userData.email,
        subscription: isPremium,
        storage_take: userData.storage_take,
        recent: userData.recent,
        profilePictureURL: userData.profilePictureURL,
        followers: userData.followers,
        description: userData.description,
        user_name: userData.user_name,
    }
    setDoc(userRef,newData)
  }
}, [isPremium]);

//CHECKING FOR AUTHENTICATED USER AND GET DATA
useEffect(() => {
  onAuthStateChanged(auth, user => {
    console.log(user)
    if (user) {
      setuser(user)
      console.log("u are logged in")
      navigation.navigate("Home")
    }
    else {
      navigation.navigate("Login")  
    }
  })
  const fetchData = async () => {
    try {
      if (currentuser) {
        const currentUserId = currentuser.uid;
        const userDocRef = doc(db, "users", currentUserId);
        

        const docSnapshot = await getDoc(userDocRef);

        if (docSnapshot.exists()) {
          // Document exists, retrieve its data
          const elementData = docSnapshot.data();
          setUserData(elementData);
        } else {
          console.log("Document does not exist.");
          setUserData(null); // Set to null or handle accordingly
        }
      }
    } catch (error) {
      console.error("Error getting document: ", error);
    }
  };
  fetchData()
}, [currentuser]);

//LOGIN
const Login = async (email,password) => {
  const logEmail = email;
  const logPass = password
  try {
    await signInWithEmailAndPassword(auth,logEmail,logPass)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log(user)
    })
  } catch(error) {
    console.log(error)
    alert("Wrong Email or Password")
  }
}

//REGISTRATION
const SignUp = async (email, password, FullName,userName) => {
  console.log("1");
  const fullName_pass = FullName;
  const regEmail = email;
  const userPassword = password;
  const user_name_pass = userName;
  
  try {
    const result = await createUserWithEmailAndPassword(auth, regEmail, userPassword);
    //RESULT == USER DATA
    const signeduser = result.user;
    //Setting Fresh Registrated user To the Document
    const userId = signeduser.uid;
    const colRef = collection(db, "users");
    const tagRef = collection(db, "users", userId, "Tags");
    //const newTagRef = doc(tagRef);
    console.log(userId);
    //SETTING USER DOCUMENT TO FIRESTORE
    try {
      await setDoc(doc(colRef, userId),{
        id: userId,
        fullname: fullName_pass,
        email: regEmail,
        subscription: false,
        storage_take:0,
        profilePictureURL: "",
        recent:"",
        user_since: new Date().toLocaleDateString(),
        followers: 0,
        description:"",
        user_name: "@" + user_name_pass,
      });
      await setDoc(doc(tagRef,userId),{
        tags:[
          "None"
        ]
      });
      console.log("Document successfully added!");
    } catch (error) {
      console.error("Error adding document: ", error);
    };
    alert("Wellcome new User create successfully");
    await sendEmailVerification(signeduser)
    window.location.href = "/" 
  } catch(err) {
    //ERROR IF ITS IN ALREADY USE
    if (err.code === "auth/email-already-in-use") {
      alert("Email already in use, try another email");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else if (err.code === AuthErrorCodes.WEAK_PASSWORD) {
      alert("Password must be at least 6 characters");
      setTimeout(() => {
        setError("");
      }, 5000);
    } else {
      setError(err.message);
    }
  }
}
    
//END VALUES ACCES To ALL JSX
const value = {
    SignUp,
    error,
    currentuser,
    Login,
}

return (
    <userContext.Provider value={value}>{children}</userContext.Provider>
)
}

export default UserAuthContext