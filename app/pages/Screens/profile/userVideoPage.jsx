
import { View, Text,ScrollView,FlatList } from 'react-native';
import VideoFrameScroll from '../../../components/HomePage/videoFrameScroll';
import { collection, doc, setDoc,getDoc,query,orderBy,limit,getDocs,startAfter } from "firebase/firestore";
import { db } from '../../../firebase';
import React, {useEffect, useState} from 'react';
import { useAuth } from '../../../context/UserAuthContext';

const UserVideoPage = ({navigation}) => {

const {currentuser} =useAuth();
//RECOMMENDED VIDEOS
const [posts, setPosts] = useState([]);
const [lastPost, setLastPost] = useState(null);


  
const fetchMoreData = async () => {
    // PAGINATION
    const videoRef = collection(db, "users", currentuser.uid, "Videos");
  
    // Check if there are more posts to load
    if (lastPost) {
      const q = query(
        videoRef,
        orderBy("id", "desc"),
        startAfter(lastPost),
        limit(3)
      );
  
      try {
        const querySnapshot = await getDocs(q);
  
        if (querySnapshot.docs.length > 0) {
          const tempPosts = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
  
          setPosts((prevPosts) => [...prevPosts, ...tempPosts]);
          // Update lastPost with the last post in the current batch
          setLastPost(querySnapshot.docs[querySnapshot.docs.length - 1]);
        } else {
          // No more posts to load
          console.log("No more posts");
        }
      } catch (error) {
        console.error("Error fetching more data:", error);
      }
    } else {
      console.log("No last post available");
    }
  };
  

const fetchUserVideos = async () => {
    //PAGINATION
    const videoRef = collection(db, "users",currentuser.uid,"Videos");
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

useEffect(() => {
    fetchUserVideos();
}, [])

    return (
      
        <View style={{alignItems:"center",marginRight:"auto",marginLeft:"auto",marginTop:50}} >
        <FlatList
            style={{width:"100%",height:"auto"}}
            keyExtractor={(item) => item.id} 
            data={posts}
            onEndReached={fetchMoreData}
            renderItem={({item}) => (
                <VideoFrameScroll navigation={navigation} props={item.data}  />
            )}
        />
        </View>
  

   
    )
}

export default UserVideoPage;