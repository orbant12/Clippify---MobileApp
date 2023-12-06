//<***********************************>ß
//LAST EDITED: 2023.12.06
//EDITED BY: Orban Tamas
//DESC: This page is the selected video detail page, it shows the selected video , comments and recommended videos
//<***********************************>

//BASIC IMPORTS
import { View,Text,StyleSheet,SafeAreaView,Pressable,Image,Button,ScrollView,TouchableOpacity,FlatList } from "react-native"
import React,{useRef,useEffect,useState} from "react"

//COMPONENTS
import { Rating } from 'react-native-ratings';
import {Video} from "expo-av"
import VideoFrameScroll from "../../components/HomePage/videoFrameScroll"
import CommentBox from "../../components/VideoDisplay/commentBox";
import WriteComment from "../../components/VideoDisplay/writeComment";
import ReplyCommentBox from "../../components/VideoDisplay/replyCommentBox";
import ClipSavingView from "../../components/VideoDisplay/videoTrimmer/clipSavingView";

//CONTEXT
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';

//ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

//FIREBASE IMPORTS
import { collection,query,orderBy,limit,getDocs,startAfter } from "firebase/firestore";
import { db } from '../../firebase';
import { useAuth } from "../../context/UserAuthContext";


const VideoPage= ({route,navigation}) => {

//<***********************VARIABLES**********************>

//Video Data
const VideoData = route.params.data;

//Current User
const {currentuser} = useAuth();

//Slider Rate Output
const [userRated, setUserRated] = useState(0);

//Bottom Sheet Modal Logic
const [isCommentProvided, setIsCommentProvided] = useState(false);

//Comment Reply Logic
const [inReplyMode, setInReplyMode] = useState(false);

//RECOMMENDED VIDEOS PRELODAD
const [posts, setPosts] = useState([]);
const [lastPost, setLastPost] = useState(null);

//COMMENTS PRELOAD
const [comments, setComments] = useState([]);

//COMMENT TO REPLY
const [commentToReply, setCommentToReply] = useState(null);

//REPLY COMMENTS PRELOAD
const [replyArray, setReplyArray] = useState([]);

//Bottom Sheet Modal | Desc / Comment
const bottomSheetRef = useRef(null);
const snapPoints = ['65%',"100%","90%"];

//Bottom Sheet Modal | Clip Save
const bottomSheetRef2 = useRef(null);
const snapPoints2 = ['65%',"100%","90%"];

//<***********************FUNCTIONS**********************>

//Bottom Sheet COMMENT Opener
function handleCommentsOpen() {
    bottomSheetRef.current?.present();
    //Comment Logic
    setIsCommentProvided(true);
}

//Bottom Sheet DESC Opener
function handleDescOpen() {
    bottomSheetRef.current?.present();
    //Desc Logic
    setIsCommentProvided(false);
}

//Bottom Sheet - Comment Input Write / Focus
const triggerCommentWrite = () => {
    bottomSheetRef.current?.snapToIndex(1);
}

//Bottom Sheet - Comment Input Write / Focus END (90%)
const triggerCommentWriteEnd = () => {
    bottomSheetRef.current?.snapToIndex(2);
}

const fetchReply = async (commentID) => {
    const replyRef = collection(db,"videos",VideoData.id,"comments",commentID,"reply");
    const replySnapshot = await getDocs(replyRef);
    const replyList = replySnapshot.docs.map(doc => doc.data());
    setReplyArray(replyList);
}

//Bottom Sheet REPLY MODE
const handleReplyMode = (commentData) => {
    setCommentToReply(commentData)
    setInReplyMode(true);
    fetchReply(commentData.id);
}

//Preload Recommended Videos MORE
const fetchMoreData = async () => {
    //PAGINATION
    const videoRef = collection(db, "videos");
    const q = query(videoRef, orderBy("id", "desc"),startAfter(lastPost), limit(3));
    const querySnapshot = await getDocs(q);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setPosts([...posts, ...tempPosts]);
}

//Preload Recommended Videos
const fetchUserRecommendedVideos = async () => {
    //PAGINATION
    const videoRef = collection(db, "videos");
    const q = query(videoRef, orderBy("id", "desc"), limit(3));
    const querySnapshot = await getDocs(q);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setLastPost(tempPosts[tempPosts.length - 1].data.id);
    setPosts(tempPosts);

}

//Fetch Comments
const fetchComments = async() => {
    const commentRef = collection(db, "videos",VideoData.id,"comments");
    const querySnapshot = await getDocs(commentRef);
    const tempPosts = [];
    if (querySnapshot.empty) {
        console.log("No matching documents.");
        return;
    }
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    //setLastComment(tempPosts[tempPosts.length - 1].data.id);
    setComments(tempPosts);
}

//Clip Saving
const handleCLipSaving = () => {
    bottomSheetRef2.current?.present();
}

//ON LOAD FUNCTIONS
useEffect(() => {
    //1.) Preload Recommended Videos
    fetchUserRecommendedVideos();

    //2.)Fetch Comments
    fetchComments();
}, [])


return (
<GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
        <SafeAreaView>
            <Video
                source={{uri: VideoData.video}}
                style={styles.video}
                resizeMode={'cover'}
                isLooping={true}
                shouldPlay={true}
                useNativeControls={true}
            />

            <View style={styles.recommendVideos}>
                <FlatList
                    ListHeaderComponent={  
                        <ScrollView>
                            {/* Title and Data Section */}
                            <Pressable onPress={handleDescOpen} style={({pressed}) => [
                            {
                                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                            }]}>
                            <View style={styles.desc}>
                                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">{VideoData.title}</Text>
                                <Text style={{marginTop:5}}>{VideoData.views} Views • 3 days ago</Text>
                            </View>
                            </Pressable>
                            
                            {/* Uploader Section */}
                            <View style={styles.uploaderSection}>
                                <View style={{flexDirection:"row",alignItems:"center",width:"50%",marginLeft:10}}>
                                    <Image
                                    style={[styles.profilePicture]}
                                    source={{uri: VideoData.uploader_avatar}}
                                
                                    />
                                    <Text style={{paddingLeft:10,maxWidth:130}} numberOfLines={1} ellipsizeMode="tail" >{VideoData.uploader_fullname}</Text>
                                    <Text style={{paddingLeft:20}}>{VideoData.uploader_followers}</Text>
                                </View>
                        
                                <Button title="Follow"/>
                            </View>
                            
                            {/* User FEEDBACK Row */}
                            <View style={styles.userFeedback}>
                                <View style={{flexDirection:"column",height:60,justifyContent:"space-evenly"}}>
                                    <Rating
                                        type='heart'
                                        ratingCount={5}
                                        onFinishRating={rating => setUserRated(rating)}
                                        imageSize={30}
                                        jumpValue={0.5}
                                        fractions={1}
                                        startingValue={0}
                                        tintColor="#1DA1F2"
                                        style={{borderRadius:30,padding:5,borderWidth:2,backgroundColor:"#1DA1F2",boxShadow:"rgba(0, 0, 0, 0.35) 0px 5px 15px"}}
                                        onSwipeRating={(rating) => setUserRated(rating)}
                                    />
                        
                                </View>
                                <ScrollView horizontal>
                                    <TouchableOpacity style={styles.buttonStyle} onPress={() => alert("hey")}> 
                                        <Text>Share</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.buttonStyle} onPress={() => handleCLipSaving()}> 
                                        <Text>Clip</Text>
                                    </TouchableOpacity>
                                    
                                    <TouchableOpacity style={styles.buttonStyle} onPress={() => alert("hey")}> 
                                        <Text>Watch Later</Text>
                                    </TouchableOpacity>
                                </ScrollView>
                            </View>
                    
                            <Pressable onPress={handleCommentsOpen}  style={({pressed}) => [
                                {
                                backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                                },
                                styles.CommentTease2
                                ]}>
                                <View style={styles.CommentTease}>
                                    <View style={{flexDirection:"row"}}>
                                        <Text>Comments</Text>
                                        <Text style={{marginLeft:10}}>{comments.length}</Text>
                                    </View>
                                    {!comments.length == 0 ? (
                                        <View>
                                            <Rating
                                                    type='heart'
                                                    ratingCount={5}
                                                    imageSize={20}
                                                    jumpValue={0.5}
                                                    fractions={1}
                                                    startingValue={comments[0].data.rate}
                                                    readonly={true}
                                                />
                                        </View>
                                    ):null}
                                </View>

                                <View style={{flexDirection:"row",alignItems:"center",marginRight:60,paddingBottom:10}}>
                                    {!comments.length == 0 ? (
                                    <>
                                        <Image
                                            style={styles.profilePicture}
                                            source={{uri: comments[0].data.profilePicture}}
                                        />
                                        <Text style={{marginLeft:10,maxWidth:210}} >{comments[0].data.text}</Text>
                                    </>
                                    ):(
                                    <>
                                        <Text style={{marginLeft:10,maxWidth:210}} >No Comments</Text>
                                    </>
                                    )}
                                    
                                </View>
                            </Pressable>
                        </ScrollView>
                    }
                    style={{width:"100%",height:"auto"}}
                    keyExtractor={(item) => item.id} 
                    data={posts}
                    onEndReached={fetchMoreData}
                    renderItem={({item}) => (
                        <VideoFrameScroll navigation={navigation} props={item.data}  />
                    )}
                />
            </View>
            {/* Bottom Sheet Modal */}
            <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                backgroundStyle={{backgroundColor:"white",borderTopLeftRadius:30,borderTopRightRadius:30}}
                >
                {isCommentProvided?(
                    !inReplyMode ? 
                        (
                            <View style={styles.bottomSheetComment} >
                                <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",borderBottomColor:"gray",borderBottomWidth:2}}>
                                    <Text style={{fontWeight:"800",fontSize:22,paddingBottom:20,marginLeft:10}}>Comments</Text>
                                    <MaterialCommunityIcons
                                        name={'close'}
                                        size={25}
                                        color={"black"}
                                        style={{marginRight:20}}
                                        onPress={() => bottomSheetRef.current?.close()}
                                    />
                                </View>
                                <ScrollView style={{maxHeight:"70%"}}  >
                                    <FlatList
                                        keyExtractor={(item) => item.id}
                                        data={comments}
                                        renderItem={({item}) => (
                                            <CommentBox currentuser={currentuser} videoID={VideoData.id} replyOpenner={false} triggerReplyMode={() => handleReplyMode(item.data)} props={item.data} />
                                        )}
                                    />
                                </ScrollView>
                                <WriteComment  handleCommentWrite={triggerCommentWrite} handleCommentWriteEnd={triggerCommentWriteEnd} />
                            </View>
                        ):(
                            <View style={styles.bottomSheetComment} >
                                <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",borderBottomColor:"gray",borderBottomWidth:2}}>
                                    <View style={{flexDirection:"row"}}>
                                        <MaterialCommunityIcons
                                            name={'arrow-left'}
                                            size={25}
                                            color={"black"}
                                            style={{marginRight:20}}
                                            onPress={() => setInReplyMode(false)}
                                        />
                                        <Text style={{fontWeight:"800",fontSize:22,paddingBottom:20,marginLeft:10}}>Reply</Text>
                                    </View>
                                    <MaterialCommunityIcons
                                        name={'close'}
                                        size={25}
                                        color={"black"}
                                        style={{marginRight:20}}
                                        onPress={() => bottomSheetRef.current?.close()}
                                    />
                                </View>
                                <View style={{maxHeight:"70%"}}  >
                                    <FlatList
                                        keyExtractor={(item) => item.id}
                                        data={replyArray}
                                        ListHeaderComponent={
                                            <CommentBox currentuser={currentuser} videoID={VideoData.id} triggerReplyMode={() => handleReplyMode()} replyOpenner={true} props={commentToReply} />
                                        }
                                        renderItem={({item}) => (
                                            <ReplyCommentBox currentuser={currentuser} videoID={VideoData.id} commentID={commentToReply.id} triggerReplyMode={() => handleReplyMode()} props={item} />
                                        )}
                                    />
                                </View>
                                <WriteComment handleCommentWrite={triggerCommentWrite} handleCommentWriteEnd={triggerCommentWriteEnd} />
                            </View>
                        )
                    ):(
                        <View style={styles.bottomSheetComment} >
                            <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",borderBottomColor:"gray",borderBottomWidth:2}}>
                                <Text style={{fontWeight:"800",fontSize:22,paddingBottom:20,marginLeft:10}}>Description</Text>
                                <MaterialCommunityIcons
                                    name={'close'}
                                    size={25}
                                    color={"black"}
                                    style={{marginRight:20}}
                                    onPress={() => bottomSheetRef.current?.close()}
                                />
                            </View>
                            <ScrollView>
                                <View style={{flexDirection:"row",justifyContent:"space-evenly",width:"100%",alignItems:"center"}}>
                                    {/* CATEGORY 1 */}
                                    <View style={styles.descRow}>
                                        <Text style={styles.textHighlighter}>1.2M</Text>
                                        <Text style={styles.textSubHighlighter}>Views</Text>
                                    </View>
                                    {/* CATEGORY 2 */}
                                    <View style={styles.descRow}>
                                        <Text style={styles.textHighlighter}>4.77</Text>
                                        <Text style={styles.textSubHighlighter}>Overal Rate</Text>
                                    </View>
                                    {/* CATEGORY 3 */}
                                    <View style={styles.descRow}>
                                        <Text style={styles.textHighlighter}>Health</Text>
                                        <Text style={styles.textSubHighlighter}>Category</Text>
                                    </View>    
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"space-evenly",width:"100%",alignItems:"center"}}>
                                    {/* CATEGORY 4 */}
                                    <View style={styles.descRow}>
                                        <Text style={styles.textHighlighter}>2003.11.17</Text>
                                        <Text style={styles.textSubHighlighter}>Uploaded</Text>
                                    </View>
                                    {/* CATEGORY 5 */}
                                    <View style={styles.descRow}>
                                        <Text style={styles.textHighlighter}>01:00:12</Text>
                                        <Text style={styles.textSubHighlighter}>Duration</Text>
                                    </View>
                                </View>

                                <View style={{margin:20,marginBottom:10}}>
                                    <Text numberOfLines={4} ellipsizeMode="tail" >Description Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae aliquam sapiente qui deleniti sit rerum quae repellat autem mollitia aperiam, quis voluptate architecto voluptates earum aspernatur delectus quas doloribus soluta.</Text>
                                    <TouchableOpacity>
                                        <Text style={{marginTop:5,fontWeight:"600"}}>...Show More</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{margin:20}}>
                                    <Text style={{fontWeight:"800",fontSize:20}}>Cast Members</Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-evenly",flexWrap:"wrap",maxWidth:400,width:"100%",alignItems:"center",marginTop:40}}>
                                        <Text>Joe ROgan</Text>
                                        <Text>Elon Musk</Text>
                                        <Text>Joe ROgan</Text>
                                    </View>
                                </View>

                                <View style={{margin:20,marginBottom:250}}>
                                    <Text style={{fontWeight:"800",fontSize:20}}>Related</Text>
                                    <View style={{flexDirection:"row",justifyContent:"space-evenly",flexWrap:"wrap",maxWidth:400,width:"100%",alignItems:"center",marginTop:15}}>
                                        <Text>Shorts</Text>
                                    </View>
                                </View>
                            </ScrollView>
                        </View>
                    )
                }
            </BottomSheetModal>

            <BottomSheetModal
                ref={bottomSheetRef2}
                snapPoints={snapPoints2}
                enablePanDownToClose={true}
                backgroundStyle={{backgroundColor:"white",borderTopLeftRadius:30,borderTopRightRadius:30}}
            >
                <View>
                    {/* TITLE */}
                    <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",borderBottomColor:"gray",borderBottomWidth:2}}>
                        <Text style={{fontWeight:"800",fontSize:22,paddingBottom:20,marginLeft:10}}>Save Clip</Text>
                        <MaterialCommunityIcons
                            name={'close'}
                            size={25}
                            color={"black"}
                            style={{marginRight:20}}
                            onPress={() => bottomSheetRef2.current?.close()}
                        />
                    </View>
                    {/* CLIP SAVE */}
                    <ClipSavingView videoURL={VideoData.video} />
                </View>
            </BottomSheetModal>
        </SafeAreaView> 
    </ BottomSheetModalProvider>
</GestureHandlerRootView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    video: {
        width: '100%',
        aspectRatio: 16 / 9,
    },
        desc:{
            marginTop:10,
            marginLeft:10,
            marginRight:10,
            marginBottom:10,
        },
        title:{
            fontSize:20,
            fontWeight:"bold",
        },
        profilePicture:{
            width: 40,
            height: 40,
            borderRadius: 25,
            borderWidth: 2,
            borderColor: '#fff',
        
        },
        uploaderSection:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            width:"100%",
            marginRight:10,
            marginTop:10,
            marginBottom:10,
        },
        userFeedback:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            marginLeft:10,
            marginRight:10,
            marginTop:10,
            marginBottom:10,
        },
        buttonStyle:{
            borderRadius:10,
            backgroundColor:"#1DA1F2",
            borderWidth:2,
            padding:10,
    
            marginLeft:10

        },
        commentBottomSheetContainer: {
            backgroundColor: 'white',
            padding: 20,
            borderRadius: 10,
            alignItems: 'center',
          },
        CommentTease:{
            flexDirection:"row",
            justifyContent:"space-between",
            alignItems:"center",
            borderRadius:20,
            width:"90%",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:10,
            marginBottom:10,
        },
        CommentTease2:{
            flexDirection:"column",
            justifyContent:"flex-start",
            alignItems:"center",
            borderRadius:20,
            width:"90%",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:10,
            marginBottom:10,
        },
        bottomSheetComment:{
            flexDirection:"column",
            justifyContent:"flex-start",
            alignItems:"start",
           
            borderRadius:20,
            width:"100%",
         
         
        },
        recommendVideos:{
          
         
            width:"100%",
            marginLeft:"auto",
            marginRight:"auto",
           
          
        },
        descRow:{
            flexDirection:"column",
            marginTop:30,
            alignItems:"center",
           height:50,
           justifyContent:"space-evenly"
        
        },
        textHighlighter:{
            fontWeight:"600",
            color:"black"
        },
        textSubHighlighter:{
            fontWeight:"300",
            opacity:0.6
        }
})

export default VideoPage