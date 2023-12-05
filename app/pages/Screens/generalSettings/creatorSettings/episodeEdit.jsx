
import React,{useState,useEffect,useRef} from 'react';
import {View,Text,StyleSheet,TouchableOpacity,ScrollView,FlatList,Image} from 'react-native';
import { useAuth } from '../../../../context/UserAuthContext';
import { Icon } from 'react-native-elements';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import VideoContainer from '../../../../components/CreatorPage/VideoContainer';
import { Video } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';

//FIREBASE
import { collection, getDocs,where,query,deleteDoc,doc,updateDoc } from "firebase/firestore";
import { db, storage } from '../../../../firebase';
import { ref, listAll, deleteObject,getDownloadURL,uploadBytes } from 'firebase/storage';

const EpisodeEdit = () => {

//<**********************VARIABLES******************************>

//GET DATA FROM ROUTE
const {currentuser} = useAuth();

//BOTTOM SHEET REF
const bottomSheetRef = useRef(null);
const snapPoints = ['80%'];

//EPISODE SELECTED
const [episodeSelected,setEpisodeSelected] = useState(null);

//USER EPISODES
const [userEpisodes,setUserEpisodes] = useState([]);

//EDIT STATES
const [isThubnailEdit,setIsThubnailEdit] = useState(false);
const [isShortIntroEdit,setIsShortIntroEdit] = useState(false);
const [isTitleEdit,setIsTitleEdit] = useState(false);

//NEW THUBNAIL
const [newThubnail,setNewThubnail] = useState(null);

//NEW SHORT INTRO
const [newShortIntro,setNewShortIntro] = useState(null);

//NEW TITLE
const [newTitle,setNewTitle] = useState(null);

//<**********************FUNCTIONS******************************>

//OPEN BOTTOM SHEET
const handleBottomSheet = () => {
    bottomSheetRef.current.present();

}

//SELECTED EPISODE
const handleSelectedEpisode = (item) => {
    setEpisodeSelected(item);
    bottomSheetRef.current.close();
}


//FETCH USER EPISODES
const fetchEpisodes = async () => {
    const userRef = collection(db, "users",currentuser.uid,"Videos");
    const querySnapshot = await getDocs(userRef);
    const episodes = [];
    querySnapshot.forEach((doc) => {
        episodes.push(doc.data())
    });
    setUserEpisodes(episodes);
}

//BLOB CREATOR
const blobCreator = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    return blob;

}

//<********************EDITING FUNCTIONS******************************>

//DELET FROM STORAGE
const deleteFilesInStorage = async () => {
    const storageRef = ref(storage, `podcasts/${folderId}`);
    const storage2Ref = ref(storage, `podcasts/${folderId}/intro`);
    const storage3Ref = ref(storage, `podcasts/${folderId}/thubnail`);
    // List all items in the storage directory
    const items = await listAll(storageRef);
    const items2 = await listAll(storage2Ref);
    const items3 = await listAll(storage3Ref);

    // Delete each file in the storage directory
    await Promise.all(items.items.map(async (item) => {
        await deleteObject(item);
    }));
    await Promise.all(items2.items.map(async (item) => {
        await deleteObject(item);
    }));
    await Promise.all(items3.items.map(async (item) => {
        await deleteObject(item);
    }));
};
//DELETE VIDEO
const handleVideoDelete = async() => {
    //1.) Delete video from user videos
    const videoUserRef = doc(db, "users",currentuser.uid,"Videos",episodeSelected.id);
    await deleteDoc(videoUserRef);
    console.log("Video Deleted from user videos")
    //2.) Delete video from videos
    const videoRef = doc(db, "videos",episodeSelected.id);
    await deleteDoc(videoRef);
    console.log("Video Deleted from user videos")
    //3.) Delete video from user videos
    await deleteFilesInStorage();
    fetchEpisodes();
}

//UPLOAD NEW MEDIA
const handleNewUpload = async (mediaType) => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaType,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
    });
    if (!result.canceled && mediaType === "Videos") {
        setNewShortIntro(result.assets[0].uri);
    }else if(!result.canceled && mediaType === "Images"){
        setNewThubnail(result.assets[0].uri);
    }else{
        console.log("Video not selected")
    }
};

//EDIT THUBNAIL
const handleThubnailEdit = () => {
    if(isThubnailEdit){
        setNewThubnail(null);
    }
    setIsThubnailEdit(!isThubnailEdit);
}
//SAVE THUBNAIL
const handleThubnailSave = async() => {
    const randomUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //UPDATE DOCS
    const videoRef = doc(db, "users", currentuser.uid, "Videos", episodeSelected.id);
    const publickVideoRef = doc(db, "videos", episodeSelected.id);
    const storageRef = ref(storage, `podcasts/${episodeSelected.id}/thubnail/${randomUID}`);
    const thumbBlob = await blobCreator(newThubnail);
    await uploadBytes(storageRef, thumbBlob);
    const URL = await getDownloadURL(storageRef);
    //UPDATE DOCS
    updateDoc(videoRef, {
        thubnail: URL,
    });
    updateDoc(publickVideoRef, {
        thubnail: URL,
    });
    //UPDATE STORAGE
    alert("Thubnail Updated")
    setIsThubnailEdit(false);
    handleSelectedEpisode(episodeSelected);
}

//EDIT SHORT INTRO
const handleShortIntroEdit = () => {
    if(isShortIntroEdit){
        setNewShortIntro(null);
    }
    setIsShortIntroEdit(!isShortIntroEdit);
}
//SAVE SHORT INTRO
const handleShortIntroSave = async() => {
    const randomUID = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    //UPDATE DOCS
    const videoRef = doc(db, "users", currentuser.uid, "Videos", episodeSelected.id);
    const publickVideoRef = doc(db, "videos", episodeSelected.id);
    const storageRef = ref(storage, `podcasts/${episodeSelected.id}/intro/${randomUID}`);
    const introBlob = await blobCreator(newShortIntro);
    await uploadBytes(storageRef, introBlob);
    const URL = await getDownloadURL(storageRef);
    //UPDATE DOCS
    console.log(URL)
    alert("Intro Updated Successfully !")
    updateDoc(videoRef, {
        intro: URL,
    });
    updateDoc(publickVideoRef, {
        intro: URL,
    });
    //UPDATE STORAGE
    alert("Short Inro Updated")
    setIsShortIntroEdit(false);
    handleSelectedEpisode(episodeSelected);
}

//EDIT TITLE
const handleTitleEdit = () => {
    console.log("Edit Title")
}
//SAVE TITLE
const handleTitleSave = async() => {

}

//EDIT CATEGORY
const handleCategoryEdit = () => {
    console.log("Edit Category")
}

//EDIT CAST
const handleCastEdit = () => {
    console.log("Edit Cast")
}

//EDIT DESCRIPTION
const handleDescriptionEdit = () => {
    console.log("Edit Description")
}

useEffect(() => {
    //1.) Fetch currentuser podcast episodes
    fetchEpisodes();
}, []);

return (
<GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
        <View style={styles.container}>
            <View style={styles.firstRow}>
                <TouchableOpacity onPress={handleBottomSheet} style={styles.episodeSelect}>
                    <Text style={{fontWeight:"600"}}>Select Episode</Text>
                </TouchableOpacity>
                
                {episodeSelected != null ? (
                <TouchableOpacity style={styles.deleteSelect}>
                    <Icon
                        name='delete'
                        type='material'
                        color='red'
                        size={20} 
                    />
                    <Text>Delete</Text>
                </TouchableOpacity>
                ):(
                <TouchableOpacity style={{marginRight:10}}>
                    <Icon
                        name='info'
                        type='material'
                        color='black'
                        size={25} 
                    />
                </TouchableOpacity>
                )}
            </View>
            {episodeSelected != null ? (
            <ScrollView >
                {/* VIDEO EDIT */}
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>Video</Text>
                    <Video
                        source={{uri: episodeSelected.video}}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                        style={{ width: "80%", aspectRatio: 16 / 9,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}
                    />
                    <TouchableOpacity onPress={handleVideoDelete} style={styles.buttonEdit}>
                        <Icon
                            name='delete'
                            type='material'
                            color='red'
                            size={25}
                            style={{opacity:0.5}}
                        />
                    </TouchableOpacity>
                </View>
                {/* THUBNAIL EDIT */}
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>Thumbnail</Text>
                    {!isThubnailEdit ? (
                    <>
                        <Image
                        source={{uri: episodeSelected.thubnail}}
                        style={{ width: "80%", aspectRatio: 16 / 9,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}
                        />
                        <TouchableOpacity onPress={handleThubnailEdit} style={styles.buttonEdit}>
                            <Icon
                                name='edit'
                                type='material'
                                color='blue'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </>
                    ) : (
                        <>
                        {newThubnail != null ? (
                        <>
                            <Image
                                source={{uri: newThubnail}}
                                style={{ width: "80%", aspectRatio: 16 / 9,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}
                            />
                            <TouchableOpacity style={styles.saveButton} onPress={handleThubnailSave} >
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </>
                        ):(
                            <TouchableOpacity onPress={() => handleNewUpload("Images")} style={styles.uploadNewButton}>
                                <Text>Upload New</Text>
                            </TouchableOpacity>
                        )}
                        
                    <TouchableOpacity onPress={handleThubnailEdit} style={styles.buttonEdit}>
                        <Icon
                            name='undo'
                            type='material'
                            color='red'
                            size={25}
                            style={{opacity:0.5}}
                        />
                    </TouchableOpacity>
                    </>
                    )}
                    
                </View>
                {/* SHORT EDIT */}
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>Short Intro</Text>
                    {!isShortIntroEdit ? (
                    <>
                        <Video
                            source={{uri: episodeSelected.video}}
                            isMuted={true}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            style={{ width: "50%", aspectRatio: 9 / 16,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}
                        />
                        <TouchableOpacity onPress={handleShortIntroEdit} style={styles.buttonEdit}>
                            <Icon
                                name='edit'
                                type='material'
                                color='blue'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </>
                    ) : (
                    <>
                        {newShortIntro != null ? (
                        <>
                            <Video
                                source={{uri: newShortIntro}}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={{ width: "50%", aspectRatio: 9 / 16,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}
                            />

                            <TouchableOpacity style={styles.saveButton} onPress={handleShortIntroSave} >
                                <Text>Save</Text>
                            </TouchableOpacity>
                        </>
                        ) : (
                        <TouchableOpacity onPress={() => handleNewUpload("Videos")} style={styles.uploadNewButton}>
                            <Text>Upload New</Text>
                        </TouchableOpacity>
                        )}
                  
                        <TouchableOpacity onPress={handleShortIntroEdit} style={styles.buttonEdit}>
                            <Icon
                                name='undo'
                                type='material'
                                color='red'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </>
                    )}

                </View>
                {/* TITLE EDIT */}
                <ScrollView horizontal>
                    <View style={[styles.itemContainer,{marginLeft:30}]}>
                        <Text style={styles.title}>Title</Text>
                        <Text style={{ width: "100%",padding:20,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}>
                            {episodeSelected.title}
                        </Text>
                        <TouchableOpacity onPress={handleTitleEdit} style={styles.buttonEditBottom}>
                            <Icon
                                name='edit'
                                type='material'
                                color='blue'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.itemContainer,{marginLeft:30}]}>
                        <Text style={styles.title}>Category</Text>
                        <Text style={{ width: "100%",padding:20,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}>
                            {episodeSelected.video_category}
                        </Text>
                        <TouchableOpacity onPress={handleCategoryEdit} style={styles.buttonEditBottom}>
                            <Icon
                                name='edit'
                                type='material'
                                color='blue'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.itemContainer,{marginLeft:30}]}>
                        <Text style={styles.title}>Cast</Text>
                        <Text style={{ width: "100%",padding:20,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }}>
                            {episodeSelected.video_category}
                        </Text>
                        <TouchableOpacity onPress={handleCastEdit} style={styles.buttonEditBottom}>
                            <Icon
                                name='edit'
                                type='material'
                                color='blue'
                                size={25}
                                style={{opacity:0.5}}
                            />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {/* DESCRIPTION EDIT */}
                <View style={styles.itemContainer}>
                    <Text style={styles.title}>Description</Text>
                    <Text style={{ width: "90%",padding:10,borderRadius:20,borderWidth:3,marginLeft:"auto",marginRight:"auto" }} >
                        {episodeSelected.description}
                    </Text>
                    <TouchableOpacity onPress={handleDescriptionEdit} style={styles.buttonEdit}>
                        <Icon
                            name='edit'
                            type='material'
                            color='blue'
                            size={25}
                            style={{opacity:0.5}}
                        />
                    </TouchableOpacity>
                </View>
            </ScrollView>
            ):null}
        </View>
        {/* BOTTOM SHEET */}
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
        >
            <View style={styles.bottomSheetComment} >
                {/* SHEET TITLE */}
                <View style={{flexDirection:"row",justifyContent:"space-between",width:"100%",borderBottomColor:"gray",borderBottomWidth:2,paddingTop:10}}>
                    <Text style={{fontWeight:"800",fontSize:22,paddingBottom:20,marginLeft:10}}>Your Episodes</Text>
                    <Icon
                        name='close'
                        type='material'
                        color='black'
                        size={25}
                        style={{marginRight:20}}
                    />
                </View>  
                {/* EPISODES */}
                <View>
                    <FlatList
                        data={userEpisodes}
                        renderItem={({item}) => (
                        <TouchableOpacity onPress={() => handleSelectedEpisode(item)}>
                            <VideoContainer item={item} />
                        </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                </View>
            </View>
        </BottomSheetModal>
    </BottomSheetModalProvider>
</GestureHandlerRootView>
)
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#fff"
    },
    episodeSelect:{
        padding:15,
        borderWidth:2,
        width:"40%",
        alignItems:"center",
        borderRadius:10,
    },
    deleteSelect:{
        flexDirection:"row",
        alignItems:"center",
        padding:10,
        borderWidth:1,
        borderStyle:"dashed",
        width:"30%",
        justifyContent:"space-around",
    },  
    firstRow:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:20,
        width:"100%",
        borderBottomWidth:0.3,
    },
    itemContainer:{
        flexDirection:"column",
        alignItems:"center",
        marginTop:30,
        paddingBottom:30,
        borderBottomWidth:0.3,
    },
    buttonEdit:{
        position:"absolute",
        top:10,
        right:10,
        backgroundColor:"white",
        borderRadius:50,
        padding:10,
        borderWidth:1,
        borderColor:"gray"
    },
    title:{
        fontWeight:"600",
        fontSize:18,
        marginBottom:10,
        
    },
    buttonEditBottom:{
        position:"relative",
        backgroundColor:"white",
        borderRadius:50,
        padding:5,
        borderWidth:1,
        borderColor:"gray",
        marginTop:10
    },
    uploadNewButton:{
        width:"60%",
        padding:20,
        borderRadius:20,
        borderWidth:3,
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:10,
        alignItems:"center",
        backgroundColor:"orange"
    },
    saveButton:{
        width:"30%",
        padding:10,
        borderRadius:20,
        borderWidth:2,
        marginLeft:"auto",
        marginRight:"auto",
        marginTop:10,
        alignItems:"center",
    
    },
    
})

export default EpisodeEdit;