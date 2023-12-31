import { View,StyleSheet,Text,FlatList } from "react-native"
import React,{useEffect,useState} from "react"
import { useAuth } from "../../context/UserAuthContext"
import { collection,getDocs,getDoc,doc } from "firebase/firestore";
import { db } from "../../firebase";
import FileCard from "../../components/HomePage/fileCard";

const FolderPage = ({navigation,route}) => {

    const folderProps = route.params.data

    const [userFile, setUserFile] = useState([]);
    const { currentuser } = useAuth();

    useEffect(() => {
        //FETCH USER DATA
        const fetchData = async () => {
        if (!currentuser) {
            // No user is logged in, clear the folders
            setUserFile([]);
            return;
        };
        //USER ID & STORAGE REF
        const currentUserId = currentuser.uid;
        const colRef = collection(db, "users", currentUserId, "File-Storage",folderProps.id,"Files");
        //FETCH AND DISPLAY FOLDER ELEMENTS
        getDocs(colRef)
        .then((querySnapshot) => {
            const userFiles = [];
            querySnapshot.forEach((doc) => {
                userFiles.push({ id: doc.id, ...doc.data() });
            });
            setUserFile(userFiles);
        })
        .catch((error) => {
            console.error("Error fetching user folders: ", error);
        });
        }
        // Call fetchData
        fetchData();
    }, [])
return (
    <View style={styles.container}>
       <FlatList
        data={userFile}
        renderItem={({item}) => <FileCard props={item} navigation={navigation} />}
        keyExtractor={(item) => item.id}
       />
    </View>
)
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
})

export default FolderPage;