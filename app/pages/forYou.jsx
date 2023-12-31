//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the for you page, where the user can see the short podcast intro videos from the database
//<********************************************>

//BASICS
import React, {useEffect, useState,useRef} from 'react';
import { View,FlatList,StyleSheet,Text,Pressable,TextInput } from 'react-native';
import FolderCard from "../components/HomePage/fodlerCard";
import ColorPicker from 'react-native-wheel-color-picker';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
//FIREBASE
import { collection,getDocs,addDoc,updateDoc,doc } from "firebase/firestore";
import { db } from '../firebase';
//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//COMPONENTS



const ForYouPage = ({navigation}) => {

//<********************VARIABLES************************>

const [folders, setFolders] = useState([]);


const [color, setColor] = useState("");

const [folderTitle, setFolderTitle] = useState("");

const bottomSheetRef = useRef(null);

const snapPoints = ['60%'];




const onColorChange = color => {
    setColor(color);
  };

const { currentuser } = useAuth();

function handleTitleInputChange(e){
    setFolderTitle(e)
}

const fetchData = async () => {
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



const handleCreateFolder = async() =>   {
    if(currentuser){
        if(folderTitle !== "" && color.length !== ""){
            const folderRef = collection(db, "users", currentuser.uid, "File-Storage",);
            const documentREF = await addDoc(folderRef, {
                title: folderTitle,
                color: color,
                files_count: 0,
            })
            updateDoc(doc(db, "users", currentuser.uid, "File-Storage", documentREF.id), {
                id: documentREF.id,
            })
         
            
            alert("Folder Created")
            fetchData()
            setFolderTitle("")
            setColor("")
            setIsFolderEditing(false)
            
        }else{
            alert("Please fill out all fields")
        }
    }else{
        alert("Please sign in")
    }
}

const handleBottomSheetOpen = () => {
    bottomSheetRef.current?.present();
}

const handleBottomSheetClose = () => {
    bottomSheetRef.current?.close();
}


useEffect(() => {
    //FETCH USER DATA
 
    // Call fetchData
    fetchData();
}, [])


//<********************FUNCTIONS************************>

return(
<GestureHandlerRootView style={{ flex: 1 }}>
<BottomSheetModalProvider>
<View style={styles.container}>

    {folders.length == 0 ? (
        <View>
        <View style={styles.boxContainer}>
            <Text style={{fontWeight:600,color:"white"}}>
                + Create new folder
            </Text>
        </View>
        </View>) :
    (
        <FlatList
        data={folders}
        ListHeaderComponent={ 
            <Pressable onPress={handleBottomSheetOpen}>
        <View style={styles.boxContainer}>
                <Text style={{fontWeight:600,color:"white"}}>
                    + Create new folder
                </Text>
        </View>
        </Pressable>
    }
        renderItem={({item}) => <FolderCard props={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
    />
    )}
    
</View>
    <BottomSheetModal
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleIndicatorStyle={{backgroundColor:"black"}}
        handleStyle={{backgroundColor:"white"}}
    >
        <View style={{flexDirection:"column",justifyContent:"space-evenly",width:"100%",backgroundColor:"transparent",alignItems:"flex-end"}}>
            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",width:"100%",padding:30,borderBlockColor:"black"}}>   
                        <View style={{flexDirection:"column",justifyContent:"space-evenly",height:180}}>  
                        <TextInput onChangeText={handleTitleInputChange} placeholder='Folder Title' style={{borderBottomWidth:1,padding:8,borderRadius:10,width:200}} />
                        <View style={{height:100,}}>
                        <ColorPicker
                            color={color}
                            onColorChange={(color) => onColorChange(color)}
                            thumbSize={20}
                            sliderSize={20}
                            noSnap={true}
                            sliderHidden={false}
                            row={false}
                            gapSize={0}
                            swatches={false}
                        
                            />
                        </View>   
                        </View>           
                        <View style={{right:0}}>
                        <Pressable onPress={handleBottomSheetClose}>
                            <MaterialCommunityIcons
                            name="close"
                            size={20}
                            color="red"

                            />
                            </Pressable>
                        </View>
            </View>
            <View style={{marginRight:10,padding:20}}>
                <Pressable onPress={() => handleCreateFolder()}>
                    <Text style={{fontWeight:"800"}}>Create</Text>
                </Pressable>
            </View>
        </View>
    </BottomSheetModal>
</BottomSheetModalProvider>
</GestureHandlerRootView>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#18191a',
        alignItems: 'center',
        paddingTop:100
    },
    boxContainer: {
        width: 300,
        height: 100,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'white',
        opacity:0.3,
        padding: 10,
        borderWidth: 1,
        flexDirection: 'row',
        borderStyle:"dashed",
        alignItems:"center",
        margin: 10,
        borderTopRightRadius:0,
    },
})

export default ForYouPage;