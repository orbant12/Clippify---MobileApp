//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the for you page, where the user can see the recommended podcasts from the database
//<********************************************>

//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable,Image } from 'react-native';

//FIREBASE
import { collection,getDocs,getDoc,doc } from "firebase/firestore";
import { db } from '../firebase';

//COMPONENTS
import FileCard from '../components/HomePage/fileCard';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//CONTEXT
import { useAuth } from '../context/UserAuthContext';
import FolderCard from '../components/HomePage/fodlerCard';

export default function TabOneScreen({navigation}) {

//<********************VARIABLES************************>

//USER DATA
const [userData, setUserData] = useState(null);

//RECENT FILES
const [recentFiles, setRecentFiles] = useState([]);

//FOLDERS
const [folders, setFolders] = useState([]);

//FOLDER URL
const [folderUrl, setFolderUrl] = useState("");

//current user
const { currentuser } = useAuth();

//<********************FUNCTIONS************************>

//UPDATES DEPENDING ON USER "FILE-Storage" DOCS
useEffect(() => {
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
    //FETCH USER DATA
    const fetchData = async () => {
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
    // Call fetchData
    fetchData();
}, [currentuser]);

//RECENTLY ADDED
useEffect(() => {
  const fetchRecent = async () => {
    try{
      if (userData !== null) {
        const fileChildrenRef = userData.recent;
        const docSnapshot = await getDoc(fileChildrenRef)
        if (docSnapshot.exists()) {
          // Document exists, retrieve its data
          const elementData = docSnapshot.data();
          setRecentFiles(elementData);
        } else {
          console.log("Document does not exist.");
          setRecentFiles([]); // Set to null or handle accordingly
        }
      }
    } catch(err) {
      console.log(err)
    }
  }
  fetchRecent();
}, [userData]);


return (
<View style={styles.container}>
  <ScrollView>
    <View style={styles.Frow}>
      <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between",paddingLeft:20}}>
        <Text style={styles.titleForYou}>Welcome Back,  {userData?.fullname}</Text>
          <Image
            style={{width: 50, height: 50, borderRadius: 50,borderColor:"black",borderWidth:1,marginRight:30,zIndex:100}}
            source={{
              uri: userData?.profilePictureURL || "https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
            }}
          />
      </View>
       
        <ScrollView style={{marginTop:20,marginBottom:0}} horizontal>
          <View style={styles.utilsContainer}>
            <MaterialCommunityIcons
              name="folder"
              size={20}
              color="white"
              style={{opacity:0.8,padding:10,borderRadius:50,}}
            />
            <Text style={{color:"white",fontWeight:800,opacity:0.8}}>Storage</Text>
            <View style={{padding:10,backgroundColor:"white",position:"absolute",top:0,right:0,borderBottomLeftRadius:50}} />
          </View>

          <View style={styles.utilsContainer}>
            <MaterialCommunityIcons
              name="folder"
              size={20}
              color="white"
              style={{opacity:0.8,padding:10,borderRadius:50,}}
            />
            <Text style={{color:"white",fontWeight:800,opacity:0.8}}>Storage</Text>
            <View style={{padding:10,backgroundColor:"white",position:"absolute",top:0,right:0,borderBottomLeftRadius:50}} />
          </View>

          <View style={styles.utilsContainer}>
            <MaterialCommunityIcons
              name="folder"
              size={20}
              color="white"
              style={{opacity:0.8,padding:10,borderRadius:50,}}
            />
            <Text style={{color:"white",fontWeight:800,opacity:0.8}}>Storage</Text>
            <View style={{padding:10,backgroundColor:"white",position:"absolute",top:0,right:0,borderBottomLeftRadius:50}} />
          </View>
        </ScrollView>
    </View>
    <View style={{height:1,opacity:0.1,width:"80%",borderWidth:1,borderColor:"white",marginRight:"auto",marginLeft:"auto",margin:40}}/>
    <View style={{padding:20}} >
      <Text style={[styles.titleForYou,{opacity:0.8,fontWeight:600}]}>Recently Added</Text>
      <View >
        {!recentFiles? (
          <Text style={{color:"white",opacity:0.2,fontWeight:600,margin:10}}>No Files Added yet</Text>
        ):(
          <FileCard navigation={navigation} props={recentFiles}/>
        )}
      </View>
    </View>
    <View style={{height:1,opacity:0.1,width:"80%",borderWidth:1,borderColor:"white",marginRight:"auto",marginLeft:"auto",margin:40}}/>
    <View style={{padding:20}}>
      <Text style={[styles.titleForYou,{opacity:0.8,fontWeight:600}]}>Your Memory</Text>
      {folders.length == 0 ? (
        <Text style={{color:"white",opacity:0.2,fontWeight:600,margin:10,marginBottom:100}}>No Folder Added yet</Text>
      ):(
      <>
        <FlatList
          data={folders}
          renderItem={({item}) => <FolderCard navigation={navigation} props={item} />}
          showsVerticalScrollIndicator={false}
          snapToInterval={300}
        />
      </>
      )}
    </View>
    </ScrollView>
</View>

);
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: '#18191a',
      flexDirection: 'column',
      paddingTop:130
  },
  Frow: {
      flexDirection: 'column',
      width: '100%',

  },
  titleForYou: {
      fontSize: 20,
      fontWeight: 'bold',
      color: 'white',
  },
  utilsContainer: {
      flexDirection: 'column',
      alignItems: 'center',
      width: 120,
      height:150,
      justifyContent: 'center',
      borderBottomWidth: 1, 
      borderWidth:1,
      borderRadius:10,
      backgroundColor: "black",
      marginLeft:10
  },
});