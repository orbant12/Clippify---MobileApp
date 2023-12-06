//<********************************************>
//NOT IN USE
//LABELED AT 2023-12-06
//<********************************************>

import React from 'react';
import {View,Text,Image,TouchableOpacity,StyleSheet} from 'react-native';
import { Rating, AirbnbRating } from 'react-native-ratings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const SubCommentBox = () => {

const [isLiked,setIsLiked] = React.useState(false);
const [isDisLiked,setIsDisLiked] = React.useState(false);
const [replyComments,setReplyComments] = React.useState([]);
const [isReplyOpen,setIsReplyOpen] = React.useState(false);
return (

<View style={{flexDirection:"column",width:"100%",height:"auto",justifyContent:"space-evenly",marginTop:15}}>
    <View style={{flexDirection:"row",margin:10}}>
        <Image
                style={{width: 20,
                    height: 20,
                    borderRadius: 25,
                    }}
                source={{uri: "https://picsum.photos/200/300"}}
        />
        <View style={{flexWrap:"nowrap"}}>
        <Text style={stylesC.usernameComment} numberOfLines={1} ellipsizeMode="tail">@Joe Rogan</Text>
        <Text style={stylesC.textComment}>I really Liked it</Text>
        </View>
        <Text style={{fontWeight:"300",fontSize:12,marginRight:10}}>
        • 3 days
        </Text>
        
        <View>
  
        <MaterialCommunityIcons
                        name={'dots-vertical'}
                        size={20}
                        color={"black"}
                        style={{marginLeft:50,opacity:0.4}}
                        onPress={() => alert("Options")}
                    />

        </View>
       
    </View>

    <View style={{flexDirection:"row",justifyContent:"flex-start",width:"70%",marginLeft:30,marginTop:5}}>
        <View style={{flexDirection:"row",width:"30%"}}>
        {isLiked?(
    <MaterialCommunityIcons
                name={'heart'}
                size={18}
                color={"red"}
                onPress={() => setIsLiked(!isLiked)}
    />
            ):(
    <MaterialCommunityIcons
                name={'heart-outline'}
                size={18}
                color={"red"}
                style={{opacity:0.4}}
                onPress={() => setIsLiked(!isLiked)}
    />
    )      }
    <Text style={{marginLeft:3,opacity:0.6,fontSize:12}}>120</Text>
    </View>

    <View style={{flexDirection:"row",width:"30%"}}>
        {isDisLiked?(
    <MaterialCommunityIcons
                name={'heart-broken'}
                size={18}
                color={"red"}
                
                onPress={() => setIsDisLiked(!isDisLiked)}
    />
            ):(
    <MaterialCommunityIcons
                name={'heart-broken-outline'}
                size={18}
                color={"red"}
                style={{opacity:0.4}}
                onPress={() => setIsDisLiked(!isDisLiked)}
    />
    )      }
    <Text style={{marginLeft:3,opacity:0.6,fontSize:12}}>120</Text>
    </View>
    
    <TouchableOpacity style={{width:"30%"}} onPress={()=> alert("hey")}>
    <Text style={{fontSize:13}}>Reply</Text>
    </TouchableOpacity>
    </View>
    



</View>
)
}

const stylesC = StyleSheet.create({
    usernameComment:{
        fontWeight:"300",
        fontSize:12,
        marginLeft:10,
        maxWidth:120,
        width:150,
   
    },
    textComment:{
        marginLeft:10,
        fontWeight:"500",
        marginTop:3
    }
})


export default SubCommentBox;
