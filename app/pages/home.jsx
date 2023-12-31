//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the for you page, where the user can see the recommended podcasts from the database
//<********************************************>

//BASIC IMPORTS
import React, {useEffect, useState} from 'react';
import { ScrollView,StyleSheet,Text,View,FlatList, Pressable } from 'react-native';

//FIREBASE
import { collection,getDocs,getDoc,doc } from "firebase/firestore";
import { db } from '../firebase';

//COMPONENTS
import FileCard from '../components/HomePage/fileCard';

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
        <Text style={styles.titleForYou}>Welcome Back, {}</Text>
        <ScrollView style={{margin:40}} horizontal>
          <Text>Valami</Text>
        </ScrollView>
    </View>
    <View style={{height:1,opacity:0.1,width:"80%",borderWidth:1,borderColor:"black",marginRight:"auto",marginLeft:"auto",margin:40}}/>
    <View>
      <Text style={[styles.titleForYou,{opacity:0.8,fontWeight:600}]}>Recently Added</Text>
      <View>
          <FileCard navigation={navigation} props={recentFiles}/>
      </View>
    </View>
    <View style={{height:1,opacity:0.1,width:"80%",borderWidth:1,borderColor:"black",marginRight:"auto",marginLeft:"auto",margin:40}}/>
    <View>
      <Text style={[styles.titleForYou,{opacity:0.8,fontWeight:600}]}>Your Memory</Text>
      <FlatList
        data={folders}
        renderItem={({item}) => <FolderCard navigation={navigation} props={item} />}
        showsVerticalScrollIndicator={false}
        snapToInterval={300}
      />
    </View>
    </ScrollView>
</View>

);
}

const styles = StyleSheet.create({

  container: {
      flex: 1,
      backgroundColor: 'white',
      flexDirection: 'column',
      paddingTop:130
  },
  Frow: {
      flexDirection: 'column',

  },
  titleForYou: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000000',
      paddingLeft: 20,
      paddingBottom: 20,
  },
});