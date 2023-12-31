//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the inbox page, where the user can see the followed casts and the mails
//<********************************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,ScrollView, FlatList } from "react-native"
import React, {useState, useEffect } from "react"

//COMPONENTS
import InboxFollowedProfile from "../components/Inbox/followedProfile"
import SystemAlertMail from "../components/Inbox/mailRow"

//FIREBASE
import { collection,getDocs, limit,query,where,orderBy } from "firebase/firestore";
import { db } from '../firebase';

//CONTEXT
import { useAuth } from "../context/UserAuthContext";


const Inbox = ({navigation}) => {

//<********************VARIABLES************************>

//CURRENT USER
const { currentuser } = useAuth();

//FOLLOWED CASTS | LIST
const [followedCasts, setFollowedCasts] = useState([]);

//NOTIFICATIONS | LIST
const [notifications, setNotifications] = useState([]);

//<********************FUNCTIONS************************>

//FETCH FOLLOWED CASTS | LIST
const fetchFollowedCasts = async () => {
    const videoRef = collection(db, "users",currentuser.uid,"Following");;
    const querySnapshot = await getDocs(videoRef);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setFollowedCasts(tempPosts);
}

//FETCH NOTIFICATIONS
const fetchNotifications = async () => {
    const inboxRef = collection(db, "users",currentuser.uid,"Inbox");
    const q = query(inboxRef, orderBy("recived_at", "desc"),limit(10));
    const querySnapshot = await getDocs(q);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setNotifications(tempPosts);
}

useEffect(() => {
    //1.) Fetch the data
    fetchFollowedCasts();
    //2.) Fetch Notifications
    fetchNotifications();
}, [])

return (
<View style={styles.container}>
    <ScrollView>
        <View style={styles.featuresTitleRow}>
            <Text style={styles.title}>Your Mail</Text>
        </View>
        <View style={styles.mailsContainer}>
            <FlatList
                data={notifications}
                renderItem={({ item }) => (
                    <SystemAlertMail props={item.data} />
                )}
                keyExtractor={(item) => item.id}
            />
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