//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the data navigator where current user can see his/her profile and data
//<********************************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import React, { useEffect, useState } from 'react';

//COMPONENTS
import UserVideoPage from "../pages/Screens/profile/userVideoPage"
import UserClipsPage from "../pages/Screens/profile/userClipsPage"
import UserSavedPage from "../pages/Screens/profile/userSavedPage"

//ASSETS
import { Tabs} from 'react-native-collapsible-tab-view'
import { SafeAreaView } from "react-native-safe-area-context";
import Entypo from 'react-native-vector-icons/Entypo';

//CONTEXT
import { useAuth } from "../context/UserAuthContext";

//FIREBASE
import { doc,getDoc } from "firebase/firestore";
import { db } from '../firebase';


const Profile = ({navigation,handleSettings}) => {

//<********************VARIABLES************************>

//CURRENT USER DATA
const [userData, setUserData] = useState([]);

//CURRENT USER
const {currentuser} = useAuth();

//<********************FUNCTIONS************************>

//FETCH CURRENT USER DATA
const fetchUserData = async () => {
    const userRef = doc(db, "users", currentuser.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        setUserData(userSnap.data());
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

//ON PAGE LOAD
useEffect(() => {
    //1.) Fetch the user data
    fetchUserData();
}, []);


//HEADER COMPONENT | NAVIGATOR
const Header = () => {
return(
<View style={styles.rowOne}>
    <Image 
        source={{ uri: userData.thubnail }}
        style={{ width:"100%",height: 350,position:"absolute",opacity:0.2}}
    />
    <Image 
        source={{ uri: userData.profilePictureURL }}
        style={{ 
            width: 80,
            height: 80,
            borderRadius: 50,
            borderColor: "black",
            borderWidth: 1}}
        />
    <Text style={styles.userNameStyle}>
        {userData.fullname}
    </Text>

    <Text>{userData.user_name}</Text>


    <View style={styles.userStatsRow}>
        <View style={styles.centeredCol}>
            <Text style={styles.numberHighlight}>{userData.followers}</Text>
            <Text style={styles.titleNumberHighlight}>Followers</Text>
        </View>

        <View style={styles.centeredCol}>
            <Text style={styles.numberHighlight}>{userData.followers}</Text>
            <Text style={styles.titleNumberHighlight}>Followers</Text>
        </View>

        <View style={styles.centeredCol}>
            <Text style={styles.numberHighlight}>{userData.followers}</Text>
            <Text style={styles.titleNumberHighlight}>Followers</Text>
        </View>
    </View>

    <View style={{flexDirection:"row",width:"50%", marginLeft:"auto",marginRight:"auto",justifyContent:"space-evenly"}}>
        <TouchableOpacity style={styles.followBTN}>
            <Text style={{color:"white",fontWeight:"600"}}>Account</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.followBTN}>
            <Text style={{color:"white",fontWeight:"600"}}>Channel</Text>
        </TouchableOpacity>
    </View>
    <Text>{userData.description}</Text>
</View>
)}


return ( 
<View style={styles.container}>        
    <Tabs.Container
        renderHeader={Header}
        style={{backgroundColor:"white"}}
    >
        {/* VIDEO PAGE */}
        <Tabs.Tab 
            name="A"
            label={() => <Entypo name={'camera'} size={25} color={"black"} />}
        >
            <Tabs.ScrollView>
                <UserVideoPage navigation={navigation} />
            </Tabs.ScrollView>
        </Tabs.Tab>

        {/* COMMUNITY PAGE */}
        <Tabs.Tab 
            name="B"
            label={() => <Entypo name={'video'} size={25} color={"black"} />}
            activeColor={"red"}
        >
            <Tabs.ScrollView>
                <UserVideoPage />
            </Tabs.ScrollView>
        </Tabs.Tab>

        {/* CLIPS PAGE */}
        <Tabs.Tab 
            name="C"
            label={() => <Entypo name={'video'} size={25} color={"black"} />}
        >
            <Tabs.ScrollView>
                <UserClipsPage navigation={navigation} />
            </Tabs.ScrollView>
        </Tabs.Tab>

        {/* SAVED PAGE */}
        <Tabs.Tab 
            name="D"
            label={() => <Entypo name={'save'} size={25} color={"black"} />}
        >
            <Tabs.ScrollView>
                <UserSavedPage />
            </Tabs.ScrollView>
        </Tabs.Tab>
    </Tabs.Container>     
</View>   
)}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: 'white',
    },
    rowOne: {
        alignItems: 'center',
        paddingTop: 50,
        backgroundColor: 'transparent',
        borderBottomWidth:3,
        height:350,
        borderBottomColor:"black",
        marginBottom:0,
    },
    userNameStyle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    userStatsRow: {
        flexDirection: 'row',
        width: '80%',
        marginLeft:"auto",
        marginRight:"auto",
        marginTop: 20,
    },
    centeredCol: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 100,
    },
    numberHighlight: {
        fontSize: 15,
        fontWeight: '800',
        color: '#000',
    },
    titleNumberHighlight: {
        fontSize: 12,
        fontWeight: '500',
        color: '#000',
    },
    followBTN:{
    backgroundColor:"blue",
    padding:10,
    borderRadius:10,
    marginTop:15,
    marginBottom:10,
    }
});

export default Profile