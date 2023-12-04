//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the for you page, where the user can see the short podcast intro videos from the database

//BASICS
import React, {useEffect, useState} from 'react';
import { View,FlatList,Dimensions } from 'react-native';

//FIREBASE
import { collection,query,orderBy,limit,getDocs, startAfter } from "firebase/firestore";
import { db } from '../firebase';

//COMPONENTS
import ShortPost from '../components/HomePage/ShortPost';


const ForYouPage = () => {

//<********************VARIABLES************************>

//SHORT POSTS
const [posts, setPosts] = useState([]);

//SHORT POSTS | PAGINATION
const [lastPost, setLastPost] = useState(null);


//<********************FUNCTIONS************************>

//LOAD MORE SHORTS | PAGINATION
const fetchMoreData = async () => {
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

//FETCH SHORTS
const fetchFypVideos = async () => {
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

useEffect(() => {
  fetchFypVideos();
}, []);

return(
<View style={{flex:1}}>
  <View style={{marginTop:0}}>
    <FlatList
      data={posts}
      renderItem={({item}) => <ShortPost post={item.data} />}
      showsVerticalScrollIndicator={false}
      snapToInterval={Dimensions.get('window').height - 50}
      snapToAlignment={'start'}
      decelerationRate={'fast'}
      onEndReached={fetchMoreData}
    />
  </View>
</View>
)
}

export default ForYouPage;