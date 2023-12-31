
import { View, Text,Pressable,ScrollView,TextInput,Button} from 'react-native';
import UserClipsFolder from '../../../components/ProfilePage/userClipsFolder';
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import "react-native-gesture-handler"
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import React from 'react';
import { useAuth } from "../../../context/UserAuthContext";
import ColorPicker from 'react-native-wheel-color-picker';

import FileContainer from '../../../components/ProfilePage/Clippyfy/fileContainer';
import { db } from "../../../firebase";
import { doc, addDoc, updateDoc, collection,getDocs,deleteDoc } from "firebase/firestore";


const UserClipsPage = ({navigation}) => {

    const { currentuser } = useAuth();

    const [folderList,setFolderList] = React.useState([])
   
    const [fileList,setFileList] = React.useState([])

    const [opennedFolder,setOpennedFolder] = React.useState("")
    const [opennedFolderTitle,setOpennedFolderTitle] = React.useState("")


    const fetchFolders = async() => {
        if(currentuser){
            const folderRef = collection(db, "users", currentuser.uid, "File-Storage",);
            const folderSnapshot = await getDocs(folderRef);
            const folderList = folderSnapshot.docs.map(doc => doc.data());
            setFolderList(folderList)
        }else{
            alert("Please sign in")
        }
    }

    const handleFolderOpen = async (passedId,title) => {
        try {
            if (currentuser) {
                const folderRef = collection(db, "users", currentuser.uid, "File-Storage", passedId, "Files");
                const folderSnapshot = await getDocs(folderRef);
                
                // Extract data from documents
                const folderList = folderSnapshot.docs.map(doc => doc.data());
                
                //Set Openned Folder
                setOpennedFolder(passedId)
                setOpennedFolderTitle(title)
                // Update state with the file list
                setFileList(folderList);
                
                // Assuming bottomSheetRef is a React ref
                if (bottomSheetRef.current) {
                    bottomSheetRef.current.present();
                } else {
                    console.error("Bottom sheet ref is not available");
                }
            } else {
                console.error("Current user is not available");
            }
        } catch (error) {
            console.error("Error handling folder open:", error);
        }
    };

    const newTitleRef = React.useRef(null)

    const [color, setColor] = React.useState("");
    const [folderTitle, setFolderTitle] = React.useState("")
    const [newFolderTitle, setNewFolderTitle] = React.useState("")


    const onColorChange = color => {
        setColor(color);
      };

    const bottomSheetRef = React.useRef(null);

    const snapPoints = ['60%','100%']

    const [isFolderEditing,setIsFolderEditing] = React.useState(false);
    const [isFolderTitleEditing,setIsFolderTitleEditing] = React.useState(false);

    function handleTitleInputChange(e){
        setFolderTitle(e)
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
                fetchFolders()
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

    const deleteCurrentFolder = async() => {
        if(currentuser){
            await deleteDoc(doc(db, "users", currentuser.uid, "File-Storage", opennedFolder));
            bottomSheetRef.current.close()
            await fetchFolders()
            alert("Folder Deleted")
        }
    }

    const handleNewTitleSave = async() => {
        if(newFolderTitle !== ""){
            await updateDoc(doc(db, "users", currentuser.uid, "File-Storage", opennedFolder), {
                title: newFolderTitle,
            });
            await fetchFolders()
            setOpennedFolderTitle(newFolderTitle)
            setIsFolderTitleEditing(false)
        }else{
            alert("Cannot be empty")
            setIsFolderTitleEditing(false)
        }
    }

    const handleInputEditedTitle = (e) => {
        setNewFolderTitle(e)
    }


    React.useEffect(() => {
        fetchFolders()
    },[])

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetModalProvider>
        <View style={{flex:1}}  >

            {!isFolderEditing ? 
            (
            
            <View style={{flexDirection:"column",alignItems:"center",width:"100%",padding:30,borderBlockColor:"black",borderTopWidth:1,borderBottomWidth:2,backgroundColor:"transparent"}}>
                <Pressable onPress={() => setIsFolderEditing(true)}>
            <Text style={{fontWeight:"800"}}>+ Create Folder</Text>
            </Pressable>
            </View>
            ):(
                <View style={{flexDirection:"column",justifyContent:"space-evenly",width:"100%",borderTopWidth:1,borderBottomWidth:2,backgroundColor:"transparent",alignItems:"flex-end"}}>
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
                        <Pressable onPress={() => setIsFolderEditing(false)}>
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
            )}
         

            
            {folderList.map((folder) => (
                <Pressable key={folder.id} onPress={ () => handleFolderOpen(folder.id,folder.title)}>
                    <UserClipsFolder folderTitlePass={folder.title} folderColorPass={folder.color} />
                </Pressable>
            )   
            )}
       

            
           
        </View>
        <BottomSheetModal
                    ref={bottomSheetRef}
                    snapPoints={snapPoints}
                    enablePanDownToClose={true}
                    handleIndicatorStyle={{backgroundColor:"black"}}
                  
                    handleStyle={{backgroundColor:"white"}}
                  
                   
                >
                   
                <ScrollView style={{height:"auto"}} >
                
                   {fileList.length !== 0 ? (
                    <>
                    <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
                    <Pressable onPress={() => {setIsFolderTitleEditing(!isFolderTitleEditing);}} style={{marginLeft:20}} >
                        <MaterialCommunityIcons
                        name="tools"
                        size={25}
                        color="black"

                        />
                        </Pressable>

                        <Pressable style={{marginRight:20}} onPress={deleteCurrentFolder}>
                        <MaterialCommunityIcons
                        name="delete"
                        size={25}
                        color="red"

                        />
                        </Pressable>
                    </View>

                    <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%",marginBottom:15}}>
                       {!isFolderTitleEditing ? 
                       (
                    <Text style={{fontSize:16,fontWeight:"600"}}>{opennedFolderTitle}</Text>
                       ):(
                        <View style={{flexDirection:"column"}}>
                    <TextInput onChangeText={handleInputEditedTitle} ref={newTitleRef} style={{padding:8,width:150,borderWidth:1}} placeholder={opennedFolderTitle} />
                    <Button onPress={handleNewTitleSave} title='Save' />
                    </View>
                       )}
                        
                    </View>

                        {fileList.map((file) => (
                         
                                <FileContainer navigation={navigation} item={file} />
                        
                        ))}
                        </>
                   ):(
                    <View style={{alignItems:"center"}}>
                        <View style={{width:"100%",flexDirection:"row",justifyContent:"space-between"}}>
                        <Pressable onPress={() => {setIsFolderTitleEditing(!isFolderTitleEditing);}} style={{marginLeft:20}} >
                            <MaterialCommunityIcons
                            name="tools"
                            size={25}
                            color="black"

                            />
                            </Pressable>

                            <Pressable style={{marginRight:20}} onPress={deleteCurrentFolder}>
                            <MaterialCommunityIcons
                            name="delete"
                            size={25}
                            color="red"

                            />
                            </Pressable>
                        </View>

                        <View style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",width:"100%"}}>
                           {!isFolderTitleEditing ? 
                           (
                        <Text style={{marginLeft:20,marginTop:20,fontSize:16,fontWeight:"600"}}>{opennedFolderTitle}</Text>
                           ):(
                            <>
                    <TextInput onChangeText={handleInputEditedTitle} ref={newTitleRef} style={{padding:8,width:150,borderWidth:1}} placeholder={opennedFolderTitle} />
                        <Button onPress={handleNewTitleSave} title='Save' />
                            </>
                           )}
                            
                        </View>
                  
                        <Text style={{opacity:0.6,fontSize:18,marginTop:40}}>No Clips Saved</Text>
                    </View>
                   )}
                 
                     
                        
                    </ScrollView>
                  
            </BottomSheetModal>
        </BottomSheetModalProvider>
        </GestureHandlerRootView>
    )
}

export default UserClipsPage;