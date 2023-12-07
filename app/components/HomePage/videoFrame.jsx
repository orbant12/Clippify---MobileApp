//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the for you page, where the user can see the recommended podcasts from the database
//<********************************************>

//BASIC IMPORTS
import React from 'react';
import {View, Text, Image,Pressable} from 'react-native';


const VideoFrame = ({ props , navigation }) => {

//<***********************VARIABLES**********************>



//<***********************FUNCTIONS**********************>

//NAVIGATION TO VIDEO PAGE
const handleNavigation = () => {
    //NAVIGATION TO VIDEO PAGE
    navigation.navigate('Video',{data:props});
}


return (
<View key={props.id} style={{width:300,marginVertical: 10,marginRight:10,marginBottom:20,marginLeft:20,}}>
    <Pressable onPress={handleNavigation}>
        <Image
            style={{ width: '100%', height: 200 }}
            source={{ uri: `${props.thubnail}` }}
        />
        <View style={{flexDirection:"row",alignItems:"center",maxWidth:300, marginTop:10,}}>
            <Image
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#fff',
                }}
                source={{uri: `${props.uploader_avatar}`}}
            />
            <View style={{marginLeft:10}}>
                <Text style={{fontWeight:"600",maxWidth:240}}>{props.title}</Text>
                <Text style={{overflow:"hidden",maxWidth:200,opacity:0.6}}>{props.uploader_fullname} • {props.views} Views • 4 days ago</Text>
            </View>
        </View>
    </Pressable>
</View>
)
}

export default VideoFrame;