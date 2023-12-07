//<***********************************>
//LAST EDITED: 2023.12.06
//EDITED BY: Orban Tamas
//DESC: This page is the selected category page, it shows the videos from the selected category
//<***********************************>

//BASIC IMPORTS
import React, { useEffect,useState } from 'react';
import { ScrollView, StyleSheet,View,Text,FlatList } from 'react-native';

//COMPONENTS
import VideoFrameScroll from '../../components/HomePage/videoFrameScroll';
import VideoFrame from '../../components/HomePage/videoFrame';

//FIREBASE IMPORTS
import { collection,query,orderBy,limit,getDocs,where } from "firebase/firestore";
import { db } from '../../firebase';

const SelectedCategoryPage = ({route,navigation}) => {

//GET THE SELECTED CATEGORY
const category = route.params.category;

//CATEGORY BASED VIDEOS
const [posts, setPosts] = useState([]);

//FETCH VIDEOS FROM THE SELECTED CATEGORY
const fetchVideosByCategory = async () => {
    const videoRef = collection(db, "videos");
    const q = query(videoRef, where("video_category", "==", category), orderBy("video_category"), limit(3));
    const querySnapshot = await getDocs(q);
    const tempPosts = [];
    querySnapshot.forEach((doc) => {
        tempPosts.push({
            id: doc.id,
            data: doc.data(),
        });
    });
    setPosts(tempPosts);
};

//ON PAGE LOAD
useEffect(() => {
  //1.) fetch videos from the selected category
  fetchVideosByCategory();
}, []);

return(
<View style={styles.container}>
  <FlatList 
    style={{width:"100%",paddingTop:50,height:"auto"}}
    keyExtractor={(item) => item.id} 
    data={posts}
    ItemSeparatorComponent={() =>   
      <View style={styles.container}>
        <View style={styles.header} >
          <Text style={styles.title}>Best "Just Talk" Podcasts</Text>
          <Text style={styles.moreLink}>View More</Text>
        </View>
      </View>
    }
    renderItem={({item}) => (
      <VideoFrameScroll navigation={navigation} props={item.data}  />
    )}
  />
</View>
)
}

const styles = StyleSheet.create({
    select:{
    flex: 1,
    flexDirection: 'row',
    justifyContent:"space-evenly" ,
    alignItems: 'center',
    marginLeft:"auto",
    marginRight:"auto",
      height: 50,
      width: '80%',
      backgroundColor:'none',
      marginTop:40,
    },
    backgroundVideo: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    container: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
  
    },
    title: {
      fontSize: 15,
      fontWeight: 'bold',
    },
    moreLink: {
      fontSize: 10,
      opacity: 0.5,
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    header:{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      padding: 20,
    },
    horizontalLine: {
      borderColor:"black",
      borderWidth: 1,
      opacity: 0.5,
      width: 1,
      height:20,
     // Adjust the width of the line
      marginVertical: 10, // Adjust the spacing above and below the line
    },
    selected: {
      opacity: 1,
      fontWeight: 'bold',
    },
    contentContainer: {
      flexDirection: 'row', // Arrange the content horizontally 
    },
    scrollContainer: {
      flexDirection: 'row',
    },
      postContainer:{
          width:"100%",
          height:"100%",
          backgroundColor:"white",
          alignItems:"center",
          justifyContent:"center"
      },
      videoContainer:{
          width:"100%",
          height:"100%",
          backgroundColor:"black",
          alignItems:"center",
          justifyContent:"center",
          zIndex: 1
      },
      videoFY: {
          width: '100%',
          height: '100%',
          zIndex: 1,
        },
        titleForYou: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 8,
        },
        description: {
          fontSize: 16,
          marginBottom: 16,
        },
        userInfoContainer: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        likes: {
          fontSize: 16,
          marginRight: 8,
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
        },
});

export default SelectedCategoryPage;