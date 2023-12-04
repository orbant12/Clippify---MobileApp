//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the inbox page, where the user can see the followed casts and the mails
//<********************************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,ScrollView } from "react-native"
import React, {useState, useEffect } from "react"

//COMPONENTS
import InboxFollowedProfile from "../components/Inbox/followedProfile"
import MailRow from "../components/Inbox/mailRow"

//FIREBASE
import { collection,query,orderBy,getDocs } from "firebase/firestore";
import { db } from '../firebase';

//CONTEXT
import { useAuth } from "../context/UserAuthContext";


const Inbox = ({navigation}) => {

//<********************VARIABLES************************>

//CURRENT USER
const { currentuser } = useAuth();

//FOLLOWED CASTS | LIST
const [followedCasts, setFollowedCasts] = useState([]);


//<********************FUNCTIONS************************>

//FETCH FOLLOWED CASTS | LIST
const fetchFollowedCasts = async () => {
    const videoRef = collection(db, "users",currentuser.uid,"Following");
    const q = query(videoRef, orderBy("id", "desc"));
    const querySnapshot = await getDocs(q);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setFollowedCasts(tempPosts);
}

useEffect(() => {
    //1.) Fetch the data
    fetchFollowedCasts();
}, [])

return (
<View style={styles.container}>
    <View style={styles.titleRowOne}>
        <Text style={styles.title}>Followed Casts</Text>
    </View>
            
    <View style={styles.castsContainer}>
        <ScrollView horizontal style={{width:"100%",flexDirection:"row"}}>
        {followedCasts.map((item) => (
            <InboxFollowedProfile navigation={navigation} props={item.data}  />
        ))}
            
        </ScrollView>
    </View>

    <ScrollView>
        <View style={styles.featuresTitleRow}>
            <Text style={styles.title}>Your Mail</Text>
        </View>
        <View style={styles.mailsContainer}>
            <MailRow />
            <MailRow />
            <MailRow />
        </View>
    </ScrollView>
            
</View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    titleRowOne: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop:60,
        paddingLeft:20,
    },
    featuresTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop:20,
        paddingLeft:20,
    },
    preofilePicture: {
        width: 50,
        height: 50,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 1,
    },
    castsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop:30,
        borderBottomWidth: 1, 
    },
    mailsContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        justifyContent: 'space-between',
        marginTop:30,
    },
})

export default Inbox