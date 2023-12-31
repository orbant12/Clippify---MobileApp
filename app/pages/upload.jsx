//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is where user can upload - video, thumbnail, short, details
//<********************************************>

//BASIC IMPORTS
import { View,Text,Image,TouchableOpacity,TextInput,ScrollView,Pressable } from "react-native"
import React, { useEffect,useState,useRef } from 'react';

//COMPONENTS
import Onboarding from 'react-native-onboarding-swiper';
import * as ImagePicker from 'expo-image-picker';
import { Video } from "expo-av";
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import UserClipsFolder from '../components/ProfilePage/userClipsFolder';
//FIRESBASE
import { doc, setDoc,getDoc,collection,getDocs } from "firebase/firestore";
import { db,storage } from "../firebase";
import { ref,getDownloadURL, uploadBytes } from "firebase/storage";

//CONTEXT
import { useAuth } from "../context/UserAuthContext";


const UploadPage = () => {

//<********************VARIABLES************************>

//CURRENT USER
const {currentuser} = useAuth();

//CURRENT USER DATA
const [userData, setUserData] = useState([]);

//VIDEO URL | UPLOAD
const [videoURL, setVideoURL] = useState("");

//VIDEO DURATION | METADATA
const [videoDuration,setVideoDuration] = useState(0);

//VIDEO TITLE | METADATA
const [videoTitle,setVideoTitle] = useState("");

//THUBNAIL URL | UPLOAD
const [thubnailURL,setThubnailURL] = useState("");

//VIDEO DESCRIPTION | METADATA
const [videoDescription,setVideoDescription] = useState("");

//SELECTED CATEGORY | METADATA
const [selectedCategory,setSelectedCategory] = useState("");

//SHORT URL | UPLOAD
const [shortURL,setShortURL] = useState("");

//LOADING SCREEN | LOGIC
const [loadingScreen, setLoadingScreen] = useState(false);

//FOLDERS
const [folders, setFolders] = useState([]);

//BOTTOM SHEET 
const bottomSheetRef = useRef(null);

//BOTTOM SHEET FOLDER REF
const bottomSheetFolderRef = useRef(null);


//BOTTOM SHEET | SNAP POINTS
const snapPoints = ['80%',"90%"]

//<********************FUNCTIONS************************>

//BOTTOM SHEET | OPENER
const triggerCategorySheet = () => {
  bottomSheetRef.current?.present();
}

//BOTTOM SHEET CATEGORY SELECTED | CLOSER 
const handlePickedCategory = (category) => {
  setSelectedCategory(category);
  bottomSheetRef.current?.close();
}

//BOTTOM SHEET | OPENER
const handleFolderBottomSheetOpen = () => {
  bottomSheetFolderRef.current?.present();
}

//IMAGE PICKER | UPLOAD
const pickImage = async (mediaType) => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: mediaType,
    allowsEditing: true,
    aspect: [16, 9],
    quality: 1,
  });
  if (!result.canceled && mediaType === "Videos") {
    setVideoURL(result.assets[0].uri);
    setVideoDuration(result.assets[0].duration);
  }else if(!result.canceled && mediaType === "Images"){
    setThubnailURL(result.assets[0].uri);
  }else{
    console.log("Video not selected")
  }
};

//SHORT PICKER | UPLOAD
const pickShort = async () => {
  // No permissions request is necessary for launching the image library
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: "Videos",
    allowsEditing: true,
    aspect: [9, 16],
    quality: 1,
  });
  if (!result.canceled) {
    setShortURL(result.assets[0].uri);
  }else{
    console.log("Video not selected")
  }
};

//VIDEO TITLE | INPUT HANDLER
const handleVideoTitle = (e) => {
    setVideoTitle(e.nativeEvent.text);
}

//VIDEO DESCRIPTION | INPUT HANDLER
const handleVideoDescription = (e) => {
    setVideoDescription(e.nativeEvent.text);
}

//UID GENERATOR | UPLOAD
function generateUID() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

//BLOB FETCHER | UPLOAD
async function fetchBlob(url) {
  const response = await fetch(url);
  return await response.blob();
}

//UPLOAD VIDEO | UPLOAD
const handleUploadVideo = async () => {
  setLoadingScreen(true)
  if(videoURL !== "" && currentuser){
    try{
      const videoUID = generateUID()
      const introUID = generateUID()
      const thubnailUID = generateUID()
      const userRef = doc(db, "users", currentuser.uid,"Videos",videoUID);
      const videoRef = doc(db, "videos",videoUID);
      const storageRef = ref(storage, `podcasts/${videoUID}/${videoUID}`);
      const storageThumbRef = ref(storage, `podcasts/${videoUID}/thubnail/${thubnailUID}`);
      const storageintroRef = ref(storage, `podcasts/${videoUID}/intro/${introUID}`);
  
      const [videoBlob, thubnailBlob, shortBlob] = await Promise.all([
        fetchBlob(videoURL),
        fetchBlob(thubnailURL),
        fetchBlob(shortURL),
      ]);
      console.log("Your Video is going to be analysed and uploaded ! If successful you will see it in your Video tab.")
      try{
        await Promise.all([
          uploadBytes(storageRef, videoBlob),
          uploadBytes(storageintroRef, shortBlob),
          uploadBytes(storageThumbRef, thubnailBlob),
        ]);
        console.log("Uploaded video, intro, and thumbnail.");
        try{
          const url =  await getDownloadURL(storageRef)
          const intro =  await getDownloadURL(storageintroRef)
          const thubnailURLFirebase =  await getDownloadURL(storageThumbRef)
          try{
            setDoc(userRef, {
              video: url,
              id: videoUID,
              video_category: selectedCategory,
              title: videoTitle,
              description: videoDescription,
              thubnail: thubnailURLFirebase,
              intro: intro,
              uploader_id: currentuser.uid,
              uploader_fullname: userData.fullname,
              uploader_avatar: userData.profilePictureURL,
              length: videoDuration,
              created_date: new Date().getDate(),
              created_time: new Date().getTime(),
              views: 0,
            });
            setDoc(videoRef, {
              video: url,
              id: videoUID,
              video_category: selectedCategory,
              title: videoTitle,
              description: videoDescription,
              thubnail: thubnailURLFirebase,
              intro: intro,
              uploader_id: currentuser.uid,
              uploader_fullname: userData.fullname,
              uploader_avatar: userData.profilePictureURL,
              length: videoDuration,
              created_date: new Date().getDate(),
              created_time: new Date().getTime(),
              views: 0,
            });
            alert("Video Uploaded")
          } catch(e) {
            console.log(e)
            alert("Something went wrong when uploading the video")
          }
        }catch(e){
          console.log(e)
          alert("Something went wrong when getting the video URL")
        }
      }catch(e){
        console.log(e)
        alert("Something went wrong when uploading the video")
      }
    }catch(e){
      console.log(e)
      alert("Something went wg")
    }
  }else{
    alert("Something went wrong here")
  }
}

//ON CURRENT USER LOAD
useEffect(() => {
  const fetchUserData = async () => {
  try {
    if (currentuser) {
      const currentUserId = currentuser.uid;
      const userDocRef = doc(db, "users", currentUserId);
      const docSnapshot = await getDoc(userDocRef);
      if (docSnapshot.exists()) {
        // Document exists, retrieve its data
        const elementData = docSnapshot.data();
        setUserData(elementData);
      } else {
        console.log("Document does not exist.");
        setUserData(null); // Set to null or handle accordingly
      }
    }
  } catch (error) {
    console.error("Error getting document: ", error);
  }
};

const fetchFolders = async () => {
  if (!currentuser) {
    setFolders([]);
    return;
  }
  // USER ID & FIRESTORE REF
  const currentUserId = currentuser.uid;
  const colRef = collection(db, "users", currentUserId, "File-Storage");
  // Fetch all documents (folders) in the subcollection
  getDocs(colRef)
    .then((querySnapshot) => {
      const userFolders = [];
      querySnapshot.forEach((doc) => {
        userFolders.push({ id: doc.id, ...doc.data() });
      });
    setFolders(userFolders);
    })
    .catch((error) => {
      console.error("Error fetching user folders: ", error);
    });
}

  //1.) Fetch the user data
  fetchUserData();
  fetchFolders();
},[currentuser])

//PERMISSIONS ON LOAD
useEffect(() => {
  (async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  })();
}, []);

return (
<View style={{flex:1}}>
  <Onboarding
    onDone={ videoURL.length > 0 && thubnailURL.length > 0 && shortURL.length > 0 ? () => handleUploadVideo() : () => alert("Some fields are missing !")}
    pages={[
    // 1.) UPLOAD PODCAST
    {
      backgroundColor: '#fff',
      image: <Image source={{uri: "https://picsum.photos/200/300"}} />,
      title: 
        <View style={{flex:1,marginTop:15,alignItems:"center"}}>
          <Text style={{fontWeight:"600",fontSize:18}}>Upload Your Clip</Text>
          <Text style={{marginTop:10}}>Edit the length you'd like to upload</Text>
          {videoURL.length > 0 ? (
          <>
            <Video
              source={{ uri: videoURL }}
              style={{ width: "100%",aspectRatio:16/9,marginTop:50 }}
              useNativeControls={true}
            />
            <TouchableOpacity onPress={() => pickImage("Video")} style={{marginTop:50,padding:10,backgroundColor:"orange",borderRadius:10}}>
              <Text style={{color:"white",fontWeight:"600"}}>Select New</Text>
            </TouchableOpacity>

            <View style={{marginTop:100,alignItems:"center", opacity:0.4}}>
              <Text>What a podcast !</Text>
              <Text>We are proud to have you in the Lupody Team</Text>
            </View>
          </>
          ) : (
          <TouchableOpacity onPress={() => pickImage("Videos")} style={{marginTop:150,padding:10,backgroundColor:"black",borderRadius:10}}>
            <Text style={{color:"white",fontWeight:"600"}}>Select Image</Text>
          </TouchableOpacity>
          )}
        </View>,   
    },
    // 2.) ADD DETAILS
    {
      backgroundColor: 'white', 
      title: 
      <GestureHandlerRootView style={{ flex: 1,width:"100%" }}>
      <BottomSheetModalProvider>
        <View style={{flex:1,marginTop:15,alignItems:"center",width:"100%",flexDirection:"column"}}>
          <Text style={{fontWeight:"600",fontSize:18}}>Add Details</Text>
          <Text style={{marginTop:10}}>Make it your own</Text>
          <View style={{width:"100%",marginTop:50}}>
              <View style={{width:"80%",flexDirection:"column",justifyContent:"space-evenly",marginLeft:"auto",marginRight:"auto"}}>
                  <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                    <Text style={{fontSize:16,fontWeight:"600",marginBottom:10}}>Title</Text>
                    <Text>{videoTitle.length}</Text>
                  </View>
                  <TextInput onChange={handleVideoTitle} numberOfLines={1} style={{width:"100%",padding:10,borderBlockColo:"black",borderWidth:1, borderRadius:5}} placeholder="Type here..." />
              </View>
          </View>
          <View style={{width:"100%",marginTop:50}}>
            <View style={{width:"80%",flexDirection:"column",justifyContent:"space-evenly",marginLeft:"auto",marginRight:"auto"}}>
              <View style={{flexDirection:"row",width:"100%",justifyContent:"space-between"}}>
                <Text style={{fontSize:16,fontWeight:"600",marginBottom:10}}>Folder</Text>
              </View>
              <Pressable onPress={handleFolderBottomSheetOpen}><Text style={{padding:20,backgroundColor:"transparent",color:"black",textAlign:"center",borderRadius:30,borderWidth:2,borderColor:"black"}}>Select Folder</Text></Pressable>
            </View>
          </View>
        </View>
        <BottomSheetModal
          ref={bottomSheetFolderRef}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          handleIndicatorStyle={{backgroundColor:"white"}}
          containerStyle={{width:"100%"}}
          backgroundStyle={{backgroundColor:"black",borderTopLeftRadius:30,borderTopRightRadius:30}}
        >
          <ScrollView style={{width:"100%",backgroundColor:"white",borderWidth:2,borderColor:"black"}}>
            {folders.map((folder) => (
                  <Pressable key={folder.id}>
                      <UserClipsFolder folderTitlePass={folder.title} folderColorPass={folder.color} />
                  </Pressable>
              )   
              )}
          </ScrollView>
        </BottomSheetModal>
       

        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    },
    // 3.) ADD THUBNAIL
    {
      backgroundColor: '#fff',
      image: <Image source={{uri: "https://picsum.photos/200/300"}} />,
      title:
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <View style={{flex:1,marginTop:15,alignItems:"center"}}>
              <Text style={{fontWeight:"600",fontSize:18}}>Additional Essentials</Text>
              <Text style={{marginTop:10}}>Select category to be more organised...</Text>

              <View style={!thubnailURL.length > 0 ? {width:"100%",marginTop:50,alignItems:"center"} : {width:"100%",marginTop:-100,alignItems:"center"}} >
                {selectedCategory !== "" ? (
                  <View style={{marginTop:150,alignItems:"center"}}>
                    <View style={{flexDirection:"row",marginBottom:20}}>
                      <Text>Category: </Text>
                      <TouchableOpacity onPress={triggerCategorySheet}>
                      <Text style={{fontWeight:"800"}}>{selectedCategory}</Text>
                      </TouchableOpacity>
                    </View>
                    
                    <TouchableOpacity onPress={() => triggerCategorySheet()} style={{padding:10,backgroundColor:"black",borderRadius:10}}>
                      <Text style={{color:"white",fontWeight:"600"}}>Edit Category</Text>
                    </TouchableOpacity>
                  </View>
                ):(
                  <TouchableOpacity onPress={() => triggerCategorySheet()} style={{marginTop:150,width:"70%",paddingBottom:20,paddingTop:20,marginRight:"auto",marginLeft:"auto",backgroundColor:"black",borderRadius:10,alignItems:"center"}}>
                    <Text style={{color:"white",fontWeight:"600"}}>Select Category</Text>
                  </TouchableOpacity>
                )}
              </View>
              <BottomSheetModal
                ref={bottomSheetRef}
                snapPoints={snapPoints}
                enablePanDownToClose={true}
                handleIndicatorStyle={{backgroundColor:"white"}}
                containerStyle={thubnailURL.length > 0 ? {width:"70%",marginRight:"auto",marginLeft:56}:{width:"70%"}}
                backgroundStyle={{backgroundColor:"black",borderTopLeftRadius:30,borderTopRightRadius:30}}
              >
                <ScrollView style={{width:"100%",backgroundColor:"white",borderWidth:2,borderColor:"black"}}>
                  <Pressable onPress={() => handlePickedCategory("Health")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between",borderTopWidth:2}}>
                    <Text>Health</Text>
                    <MaterialCommunityIcons
                    name="medical-bag"
                    size={20}
                    color="black"
                      />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Fitness")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Fitness</Text>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Business")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Business</Text>
                    <MaterialCommunityIcons
                    name="handshake"
                    size={20}
                    color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Finance")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Finance</Text>
                    <MaterialCommunityIcons
                      name="cash"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Science")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Science</Text>
                    <MaterialCommunityIcons
                      name="atom"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Comedy")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Comedy</Text>
                    <MaterialCommunityIcons
                      name="drama-masks"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Music")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>Music</Text>
                    <MaterialCommunityIcons
                      name="music-note"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("History")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between"}}>
                    <Text>History</Text>
                    <MaterialCommunityIcons
                      name="bookshelf"
                      size={20}
                      color="black"
                    />
                  </Pressable>

                  <Pressable onPress={() => handlePickedCategory("Politics")} style={{width:"100%",borderWidth:1,padding:15,flexDirection:"row",justifyContent:"space-between",borderBottomWidth:2}}>
                    <Text>Politics</Text>
                    <MaterialCommunityIcons
                      name="account-voice"
                      size={20}
                      color="black"
                    />
                  </Pressable>
                </ScrollView>
              </BottomSheetModal>
            </View>  
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
    },
    ]}
  />
</View>
)
}

export default UploadPage