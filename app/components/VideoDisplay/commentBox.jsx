//<***********************************>
//LAST EDITED: 2023.12.06
//EDITED BY: Orban Tamas
//DESC: This is a comment box component, it is used in the video display page
//<***********************************>

//BASIC IMPORTS
import React, { useEffect,useState } from 'react';
import {View,Text,Image,TouchableOpacity,StyleSheet,Pressable} from 'react-native';

//COMPONENTS
import { Rating } from 'react-native-ratings';

//ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//FIREBASE
import { getDocs, collection,deleteDoc,setDoc,doc } from 'firebase/firestore';
import { db } from '../../firebase';

const CommentBox = ({triggerReplyMode,props,videoID,currentuser,replyOpenner}) => {

//<********************VARIABLES************************>

//ALREADY LIKED LOGIC | LIKED
const [isLiked,setIsLiked] = useState(false);

//ALREADY LIKED LOGIC | DISLIKED
const [isDisLiked,setIsDisLiked] = useState(false);

//REPLY COMMENTS
const [replyComments,setReplyComments] = useState([]);

//REPLY OPEN LOGIC
const [isReplyOpen,setIsReplyOpen] = useState(false);

//ALL LIKES | COMMENTS | LIKES
const [commentLikes,setCommentLikes] = useState([]);

//ALL LIKES | COMMENTS | DISLIKES
const [commentDislikes,setCommentDislikes] = useState([]);

//<********************FUNCTIONS************************>

//FETCH LIKES
const fetchLikes = async () => {
  const likesRef = collection(db,"videos",videoID,"comments",props.id,"like");
  const disLikesRef = collection(db,"videos",videoID,"comments",props.id,"dislike");
  const likesSnapshot = await getDocs(likesRef);
  const disLikesSnapshot = await getDocs(disLikesRef);
  const likesList = likesSnapshot.docs.map(doc => doc.data());
  const disLikesList = disLikesSnapshot.docs.map(doc => doc.data());
  if (likesList.some(like => like.id === currentuser.uid)) {
    setIsLiked(true);
  }
  if (disLikesList.some(dislike => dislike.id === currentuser.uid)) {
    setIsDisLiked(true);
  }
  setCommentDislikes(disLikesList);
  setCommentLikes(likesList);
}

//LIKE LOGIC
const handleLikeLogic = async () => {
  if (isLiked === false) {
    const likesRef = doc(db,"videos",videoID,"comments",props.id,"like",currentuser.uid);
    const disLikesRef = doc(db,"videos",videoID,"comments",props.id,"dislike",currentuser.uid);
    //LIKE LOGIC
    setDoc(likesRef,{
      id:currentuser.uid
    });
    if(commentDislikes.some(dislike => dislike.id === currentuser.uid)){
      deleteDoc(disLikesRef)
    }
    setIsLiked(true);
    setIsDisLiked(false);
    fetchLikes();
  }
  if (isLiked === true) {
    const likesRef = doc(db,"videos",videoID,"comments",props.id,"like",currentuser.uid);
    //LIKE LOGIC
    if(commentLikes.some(like => like.id === currentuser.uid)){
      deleteDoc(likesRef)
    }
    setIsLiked(false);
    fetchLikes();
  }
}

//DISLIKE LOGIC
const handleDisLikeLogic = () => {
  const disLikesRef = doc(db,"videos",videoID,"comments",props.id,"dislike",currentuser.uid);
  const likesRef = doc(db,"videos",videoID,"comments",props.id,"like",currentuser.uid);
  if (isDisLiked === false) {
    //LIKE LOGIC
    setDoc(disLikesRef,{
      id:currentuser.uid
    });
    if(commentLikes.some(like => like.id === currentuser.uid)){
      deleteDoc(likesRef)
    }
    setIsDisLiked(true);
    setIsLiked(false);
    fetchLikes();
  }else if (isDisLiked === true) {
    //LIKE LOGIC
    if(commentDislikes.some(dislike => dislike.id === currentuser.uid)){
      deleteDoc(disLikesRef)
    }
    setIsDisLiked(false);
    fetchLikes();
  }
}

//REPLY TO REPLY LOGIC | NOT IMPLEMENTED YET !!
const handleReplyToReply = () => {
  console.log("Reply to Reply");
}

//ON LOAD
useEffect(() => { 
    //1.) Fetch Likes
    fetchLikes();
    //2.) Fetch Replies
    setIsReplyOpen(replyOpenner);
},[]);

return (
<Pressable onPress={triggerReplyMode}>
  <View style={ !isReplyOpen? {flexDirection:"column",width:"100%",height:"auto",justifyContent:"space-evenly",marginTop:15,}:{backgroundColor:"#D3D3D3",flexDirection:"column",width:"100%",height:"auto",justifyContent:"space-evenly",marginTop:15,}}>
    <View style={{flexDirection:"row",margin:10}}>
      <Image
        style={{width: 20,
          height: 20,
          borderRadius: 25,
        }}
        source={{uri: props.profilePicture}}
      />
      <View style={{flexWrap:"nowrap"}}>
        <Text style={stylesC.usernameComment} numberOfLines={1} ellipsizeMode="tail">{props.user_name}</Text>
        <Text style={stylesC.textComment}>{props.text}</Text>
      </View>
      <Text style={{fontWeight:"300",fontSize:12,marginRight:10}}>
      • 3 days
      </Text>
      <Rating
        type='heart'
        ratingCount={5}
        imageSize={15}
        jumpValue={0.5}
        fractions={1}
        startingValue={props.rate}
        readonly={true}
        style={{opacity:1}}
        tintColor= {isReplyOpen? '#D3D3D3' : '#fff'}
      />
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
            onPress={() => handleLikeLogic()}
          />
        ):(
          <MaterialCommunityIcons
            name={'heart-outline'}
            size={18}
            color={"red"}
            style={{opacity:0.4}}
            onPress={() => handleLikeLogic()}
          />
        )}
        <Text style={{marginLeft:3,opacity:0.6,fontSize:12}}>{commentLikes.length}</Text>
    </View>

    <View style={{flexDirection:"row",width:"30%"}}>
        {isDisLiked?(
    <MaterialCommunityIcons
                name={'heart-broken'}
                size={18}
                color={"red"}
                
                onPress={() => handleDisLikeLogic()}
    />
            ):(
    <MaterialCommunityIcons
                name={'heart-broken-outline'}
                size={18}
                color={"red"}
                style={{opacity:0.4}}
                onPress={() => handleDisLikeLogic()}
    />
    )      }
    <Text style={{marginLeft:3,opacity:0.6,fontSize:12}}>{commentDislikes.length}</Text>
    </View>
    
    <TouchableOpacity style={{width:"30%"}} onPress={ !isReplyOpen? ()=> triggerReplyMode() : () => handleReplyToReply()}>
    <Text style={{fontSize:13}}>Reply</Text>
    </TouchableOpacity>
    </View>
    
    {!replyComments.lenght > 0 ? (
      !isReplyOpen ? (
        <>
          <View style={{marginTop:15,marginBottom:15}}>
            <TouchableOpacity onPress={() => {triggerReplyMode();setIsReplyOpen(!isReplyOpen)}}>
              <Text style={{marginLeft:10,opacity:0.6,fontSize:13,color:"#000"}}>View 2 replies</Text>
            </TouchableOpacity>
          </View>
        </>
      ):(
        <View style={{width:"100%",borderWidth:1,opacity:0.1,marginTop:15}}></View>
      )
    ):null}
  </View>
</Pressable>
)}

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


export default CommentBox;
