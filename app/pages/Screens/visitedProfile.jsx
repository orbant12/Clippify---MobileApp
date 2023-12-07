//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the data navigator where current user can see his/her profile and data
//<********************************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import React, { useEffect, useState } from 'react';

import UserVideoPage from "./profile/userVideoPage";

//ASSETS
import { Tabs} from 'react-native-collapsible-tab-view'
import Entypo from 'react-native-vector-icons/Entypo';

//CONTEXT
import { useAuth } from "../../context/UserAuthContext";

//FIREBASE
import { collection, doc,getDoc,setDoc,getDocs,deleteDoc,updateDoc } from "firebase/firestore";
import { db } from '../../firebase';


const VisitedProfile = ({navigation,handleSettings,route}) => {

//<********************VARIABLES************************>

//USER DATA FROM PARAMS
const uploaderData = route.params.data;

//CURRENT USER DATA
const [userData, setUserData] = useState([]);

//CURRENT USER
const {currentuser} = useAuth();

//IS FOLLOWED
const [isFollowed, setIsFollowed] = useState(false);

//FOLLOWER ARRAY
const [followerArray, setFollowerArray] = useState([]);

//<********************FUNCTIONS************************>

const fetchFollowers = async (uploader) => {
    if(currentuser){
        const followerRef = collection(db, "users", uploader,"Followers");
        const followerSnap = await getDocs(followerRef);
        const followerList = followerSnap.docs.map(doc => doc.data());
        setFollowerArray(followerList)
        const userRef = doc(db, "users", uploader);
        await updateDoc(userRef, {
            followers: followerList.length
        });
        if (followerList.some(follower => follower.id === currentuser.uid)) {
            setIsFollowed(true)
        }
    }
}


//FETCH CURRENT USER DATA
const fetchUserData = async () => {
    const userRef = doc(db, "users", uploaderData.uploader_id);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
        setUserData(userSnap.data());
        fetchFollowers(userSnap.data().id);
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}

//HANDLE NAVIGATION
const handleNavigation = (page) => {
    if(page == "Account"){
        navigation.navigate("GeneralSettings",{data:page})
    }
    else if(page == "Creator Panel"){
        navigation.navigate("GeneralSettings",{data:page})
    }
}

const handleFollow = async () => {
    if(currentuser){
        if (isFollowed === false) {
        const userRef = doc(db, "users",userData.id,"Followers",currentuser.uid);
        const uploaderRef = doc(db, "users",currentuser.uid,"Following",userData.id);
        await setDoc(userRef,{
            id:currentuser.uid
        })
        await setDoc(uploaderRef,{
            id: userData.id,
        })
        setIsFollowed(true)
        }else if (isFollowed  === true) {
            const userRef = doc(db, "users", userData.id,"Followers",currentuser.uid);
            const uploaderRef = doc(db, "users",currentuser.uid,"Following",userData.id);
            if(followerArray.some(follower => follower.id === currentuser.uid)){
                await deleteDoc(userRef)
                await deleteDoc(uploaderRef)
            }
            setIsFollowed(false)
        }
    }else{
        alert("You need to be logged in to follow")
    }
}



//ON PAGE LOAD
useEffect(() => {
    //1.) Fetch the user data
    fetchUserData();
    //2.) Check if the user is followed
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
        {!isFollowed ? (
        <TouchableOpacity onPress={() => handleFollow()} style={styles.followBTN}>
            <Text style={{color:"white",fontWeight:"600"}}>Follow</Text>
        </TouchableOpacity>
        ):(
            <TouchableOpacity onPress={() => handleFollow()} style={styles.followBTN}>
                <Text style={{color:"white",fontWeight:"600"}}>Unfollow</Text>
            </TouchableOpacity>
        )}


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

export default VisitedProfile