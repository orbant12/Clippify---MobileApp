//<********************************************>
//LAST EDITED DATE: 2023.12.06
//EDITED BY: Orban Tamas
//DESCRIPTION: This is a component for the inbox page, it is a singe mail with passed data
//<********************************************>

//BASIC IMPORTS
import React, { useEffect,useState } from "react";
import { View,Text, Pressable} from "react-native";

//ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SystemAlertMail= ({props,navigation}) => {


//<********************VARIABLES************************>
const [senderData, setSenderData] = useState([]);
//<********************FUNCTIONS************************>

//NAVIGATION
const handleNavigation = () => {
    if(props.type == "system"){
        navigation.navigate('SystemAlerts');
    }
    if(props.type == "follow"){
        navigation.navigate('FollowAlerts');
    }
    if(props.type == "like"){
        navigation.navigate('LikeAlerts');
    }
    if(props.type == "comment"){
        navigation.navigate('CommentAlerts');
    }
}

//FETCH USER DATA
const fetchUserData = async () => {
    const userRef = doc(db, "users", props.sender_id);
    const docSnap = await getDoc(userRef);
    setSenderData(docSnap.data())
}

useEffect(() => {
    if(props.type == "follow" || props.type == "like" || props.type == "comment"){
        fetchUserData();
    } 

}, [])

return(     
<Pressable onPress={handleNavigation}>
    <View style={{flexDirection:"row",padding:20,width:"100%",justifyContent:"space-between",alignItems:"center",borderWidth: 1,borderColor: '#eee',}}>
        {props.type == "system" ? (
        <>
            <MaterialCommunityIcons
                name="alert"
                size={20}
                color="black"
            />
            <Text numberOfLines={3} ellipsizeMode="tail" style={{maxWidth:200}}>{props.message}</Text>
        </>
        ):null}
        {props.type == "follow" ? (
        <>
            <Image 
                source={{uri: senderData.profilePictureURL}}
                style={{ width: 50,
                height: 50,
                borderRadius: 50,
                borderColor: "black",
                borderWidth: 1,}}
            />
            <Text numberOfLines={3} ellipsizeMode="tail" style={{maxWidth:200}}>{senderData.user_name} has followed you ! Click to visit profile...</Text>
        </>
        ):null}
        {props.type == "like" ? (
        <>
            <Image 
                source={{uri: senderData.profilePictureURL}}
                style={{ width: 50,
                height: 50,
                borderRadius: 50,
                borderColor: "black",
                borderWidth: 1,}}
            />
            <Text numberOfLines={3} ellipsizeMode="tail" style={{maxWidth:200}}>{senderData.user_name} has liked your Podcast ! Click to see...</Text>
        </>
        ):null}
        {props.type == "comment" ? (
        <>
            <Image 
                source={{uri: senderData.profilePictureURL}}
                style={{ width: 50,
                height: 50,
                borderRadius: 50,
                borderColor: "black",
                borderWidth: 1,}}
            />
            <Text numberOfLines={3} ellipsizeMode="tail" style={{maxWidth:200}}>{senderData.user_name} has Commented on your Podcast ! Click to see...</Text>
        </>
        ):null}
       
        <Text style={{marginRight:10}}>{props.recived_at}</Text>
    </View>
</Pressable>
)};

export default SystemAlertMail;