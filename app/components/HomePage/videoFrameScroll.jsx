
import React from 'react';

//Components
import {View, Text, Image,Pressable} from 'react-native';


const VideoFrameScroll = ({ props,navigation }) => {

//<***********************VARIABLES**********************>

//<***********************FUNCTIONS**********************>

//NAVIGATION TO VIDEO PAGE WITH PARAMS DATA
const handleNavigation = () => {
    navigation.navigate('Video',
        {data: props,navigation:navigation}
    );
}


return (
<View style={{width:"100%",marginVertical: 10,marginBottom:40}}>
    <Pressable onPress={handleNavigation} >
        <Image
            style={{ width: '100%',aspectRatio:16/9 }}
            source={{ uri: `${props.thubnail}` }}
            alt='image'
        />
        
        <View style={{flexDirection:"row",alignItems:"center",width:"100%", marginTop:10,marginLeft:5}}>
            <Image
                style={{width: 40,
                height: 40,
                borderRadius: 25,
                borderWidth: 2,
                borderColor: '#fff',}}
                source={{uri: `${props.uploader_avatar}`}}
            />
            <View style={{marginLeft:10}}>
                <Text style={{fontWeight:"600",maxWidth:300}}>{props.title}</Text>
                <Text style={{marginTop:3,maxWidth:300,opacity:0.6}}>{props.uploader_fullname} • {props.views} Views • 4 days ago</Text>
            </View>
        </View>
    </Pressable>
</View>
)
}

export default VideoFrameScroll;