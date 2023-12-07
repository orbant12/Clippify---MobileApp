//<********************************************>
//LAST EDITED DATE: 2023.12.06
//EDITED BY: Orban Tamas
//DESCRIPTION: This is a component for the inbox page, Horizontal scrollable list of followed profiles AVATAR + FULLNAME
//<********************************************>

//BASIC IMPORTS
import { View,Text,Image, Pressable } from "react-native";
import React from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from '../../firebase';

const InboxFollowedProfile = ({navigation,props}) => {

//<********************VARIABLES************************>

//USER DATA
const [userData, setUserData] = React.useState([]);

//<********************FUNCTIONS************************>

//FETCH USER DATA
const fetchUserData = async () => {
    const userRef = doc(db, "users", props.id);
    const docSnap = await getDoc(userRef);
    setUserData(docSnap.data())
}

React.useEffect(() => {
    fetchUserData();
}, [])

return(
<Pressable onPress={() => navigation.navigate('Video',
    {data: props.id,navigation:navigation}
)}>
    <View style={{alignItems:"center",height:60,flexDirection:"column",marginLeft:30,height:80}}>
        <Image 
            source={{uri: userData.profilePictureURL}}
            style={{ width: 50,
            height: 50,
            borderRadius: 50,
            borderColor: "black",
            borderWidth: 1,}}
        />
        <Text style={{marginTop:5,fontWeight:"500",fontSize:11}}>{userData.fullname}</Text>
    </View>
</Pressable>
)}

export default InboxFollowedProfile;