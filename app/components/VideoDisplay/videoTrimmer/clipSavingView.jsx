//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is where the user can create clip and save a section of the desired video, and provide a title and tag for it || NOT FINISHED !!
//<********************************************>

//BASIC IMPORTS
import React,{useState} from 'react';
import { View,StyleSheet,Text,TouchableHighlight } from 'react-native';

//COMPONENTS
import { Video } from 'expo-av';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';
// import RNFS from 'react-native-fs';

//HELPERS
import * as helpers from './utils/helpers';


const ClipSavingView = ({videoURL}) => {

const [inputVideoFile,setInputVideoFile] = useState(null);
const [thumbnailIsProcessing,setThumbnailIsProcessing] = useState(false);
const [showBtn,setShowBtn] = useState(false);
const [deletedState,setDeletedState] = useState(false);
const [URL,setURL] = useState(null);
const [thumbnails,setThumbnails] = useState([]);
const [videoMeta,setVideoMeta] = useState(null);


const [firstLoading,setFirstLoading] = useState(true);






const handleTrimimingrigger = () => {
  if (videoURL) {
    handleConvert(videoURL)
  }
    setFirstLoading(false);
}




return(
    <View style={{ flexDirection:"column",alignItems:"center",marginTop:10 }} >
        <Video
            source={{uri: videoURL}}
            style={styles.video}
            resizeMode={'cover'}
            isLooping={true}
            shouldPlay={true}
            useNativeControls={true}
          
        />
        <TouchableHighlight onPress={handleTrimimingrigger} style={{backgroundColor:"orange",padding:10,borderRadius:10,marginTop:30}}>
            {!firstLoading ? 
            <Text style={{fontSize:15,fontWeight:"bold"}}>Loading...</Text> 
            :
            <Text style={{fontSize:15,fontWeight:"bold"}}>Clip</Text>
            }
        </TouchableHighlight>
    </View>
)
}

const styles = StyleSheet.create({
    video: {
        width: '80%',
        aspectRatio:16/9,
        borderRadius: 10,
        borderWidth: 1,
  
    },
});

export default ClipSavingView;