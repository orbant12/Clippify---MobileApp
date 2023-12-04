
import { View,Text,Image, Pressable } from "react-native";


const InboxFollowedProfile = ({navigation,props}) => {

return(
<Pressable onPress={() => navigation.navigate('Video',
        {data: props.id,navigation:navigation}
    )}>
    <View style={{alignItems:"center",height:60,flexDirection:"column",marginLeft:30,height:80}}>
        <Image 
            source={{uri: props.avatar}}
            style={{ width: 50,
            height: 50,
            borderRadius: 50,
            borderColor: "black",
            borderWidth: 1,}}
        />
        <Text style={{marginTop:5,fontWeight:"500",fontSize:11}}>{props.fullname}</Text>
    </View>
</Pressable>
)
}

export default InboxFollowedProfile;