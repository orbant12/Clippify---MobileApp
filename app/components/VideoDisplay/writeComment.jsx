

import React from 'react';
import {View,Text,Image,TextInput,TouchableOpacity,StyleSheet,ScrollView} from 'react-native';





const WriteComment = ({handleCommentWrite,handleCommentWriteEnd}) => {


    const [isEditing,setIsEditing] = React.useState(false);
    const [comment,setComment] = React.useState('');
    const [isRatingAttached,setIsRatingAttached] = React.useState(false);

    const handleUserComment = (e) => {
        setComment(e.nativeEvent.text);
    
    }

    const handleRatingAttachment = () => {
        setIsRatingAttached(!isRatingAttached);
    
    }

return (
    <ScrollView style={{width:"100%",height:50}}>
    <View style={{flexDirection:"row",borderTopColor:"gray",borderTopWidth:0.5,width:"100%"}}>
              <Image
                style={{width: 20,
                    height: 20,
                    borderRadius: 25,
                    marginLeft: 10,
                    marginTop:15
                    }}
                source={{uri: "https://picsum.photos/200/300"}}
                />

                <TextInput style={styles.textInputFocus} value={comment} onChange={handleUserComment} onEndEditing={() => {handleCommentWriteEnd();setIsEditing(false)}} onFocus={() => {handleCommentWrite();setIsEditing(true)}} placeholder='Write a comment...'/>

      
       
    </View> 
              {comment.length > 0 ?(
                <View style={{flexDirection:"row",justifyContent:"flex-end"}}>
                <TouchableOpacity onPress={handleRatingAttachment} style={!isRatingAttached? styles.userCommentProps : {backgroundColor:"green",color:"white",alignItems:"center",padding:10,borderRadius:10,marginTop:20,marginRight:20}}>
              {!isRatingAttached ? (
                 <Text>Attach Rate</Text>
              ):(
                <Text>Attached</Text>
              )}
               
            </TouchableOpacity>
            <TouchableOpacity style={styles.userCommentProps}>
                <Text>Post</Text>
            </TouchableOpacity>
            </View>
            ):null}
    </ScrollView>
)
}

const styles = StyleSheet.create({
    
    textInputFocus: {
        marginLeft: 10,marginTop:15
    },
    userCommentProps: {
        alignItems:"center",
        backgroundColor:"gray",
        padding:10,
        borderRadius:10,
        marginTop:20,
        marginRight:20
    }
});

export default WriteComment;