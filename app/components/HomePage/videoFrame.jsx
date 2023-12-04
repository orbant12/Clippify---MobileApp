
import React from 'react';
import {View, Text, Image,Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/core';

const VideoFrame = () => {

const navigator = useNavigation();

const handleNavigation = () => {
    //NAVIGATION TO VIDEO PAGE
    navigator.navigate('Video');
}

const handleLongPress = () => {
    console.log('Long Pressed');
}

return (
<View style={{width:300,marginVertical: 10,marginRight:10,marginBottom:20,marginLeft:20,}}>
    <Pressable onPress={handleNavigation} onLongPress={handleLongPress}>
          <Image
            style={{ width: '100%', height: 200 }}
            source={{ uri: 'https://picsum.photos/200/300' }}
          />
                   <View style={{flexDirection:"row",alignItems:"center",maxWidth:300, marginTop:10,}}>
          <Image
                style={{width: 40,
                    height: 40,
                    borderRadius: 25,
                    borderWidth: 2,
                    borderColor: '#fff',}}
                source={{uri: "https://picsum.photos/200/300"}}
                />
           
           <View style={{marginLeft:10}}>
           <Text style={{fontWeight:"600"}}>Title who the Gigga nigga  !!</Text>
            <Text style={{overflow:"hidden",maxWidth:200,opacity:0.6}}>Y-Combinator • 259 M Views • 4 days ago</Text>
          </View>
          
           
          
          
          </View>

    </Pressable>
</View>
)
}

export default VideoFrame;