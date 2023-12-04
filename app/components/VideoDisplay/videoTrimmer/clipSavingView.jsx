
import React,{useState,useEffect} from 'react';
import { View,StyleSheet,Text,TouchableHighlight } from 'react-native';
import { Video } from 'expo-av';
// import { FFmpegKit } from 'ffmpeg-kit-react-native';
// import RNFS from 'react-native-fs';

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



const handleVideoFileChange = async (videoFile) => {
  setInputVideoFile(videoFile);
  setDeletedState(true);
  
  console.log(videoFile);
  setURL(await helpers.readFileAsBase64(videoFile));
};


const getThumbnails = async ({ duration }) => {
  setThumbnailIsProcessing(true);
  setShowBtn(false);
  let MAX_NUMBER_OF_IMAGES = 15;
  let offset =
    duration === MAX_NUMBER_OF_IMAGES ? 1 : duration / MAX_NUMBER_OF_IMAGES;
  let NUMBER_OF_IMAGES = duration < MAX_NUMBER_OF_IMAGES ? duration : 15;

  // Use RNFS.writeFile to write the video file
  await RNFS.writeFile(inputVideoFile.name, await helpers.readFileAsBase64(inputVideoFile));

  const arrayOfImageURIs = [];
  for (let i = 0; i < NUMBER_OF_IMAGES; i++) {
    let startTimeInSecs = helpers.toTimeString(Math.round(i * offset));
    if (startTimeInSecs + offset > duration && offset > 1) {
      offset = 0;
    }
    try {
      console.log(`Generating frame ${i}`);
      await FFmpegKit.execute(
        '-ss',
        startTimeInSecs,
        '-i',
        inputVideoFile.name,
        '-t',
        '00:00:1.000',
        '-vf',
        'scale=150:-1',
        `img${i}.png`
      );

      // Use RNFS.readFile to read the file data
      const data = await RNFS.readFile(`img${i}.png`, 'base64');
      arrayOfImageURIs.push(`data:image/png;base64,${data}`);

      // Use RNFS.unlink to remove the file
      await RNFS.unlink(`img${i}.png`);
    } catch (error) {
      console.error(`Error generating frame ${i}:`, error);
    }
  }
  getFirstFrameImageURL();
  setThumbnailIsProcessing(false);
  return arrayOfImageURIs;
};


// const handleConvert = async (url) => {
//   try {
//     const file = await fetch(url).then((response) => response.blob());
//     // Create a file object with a random name
//     const fileName = `video_${Math.floor(Math.random() * 100000)}.mp4`;
//     const videoFile = new File([file], fileName, { type: 'video/mp4' });
//     await handleVideoFileChange(videoFile); // Pass the video file to the parent component
    
//   } catch (error) {
//     if(error.message === 'Failed to fetch'){
//       alert('This Video protected by law and cannot be downloaded. Convert it to mp4 format and upload it !')
//     }
//     console.error('Error fetching or converting the video:', error);

//   } finally {

//   }
// };

// const handleLoadedData = async (e) => {
//   const el = e.target;
//   const meta = {
//     name: inputVideoFile.name,
//     duration: el.duration,
//     videoWidth: el.videoWidth,
//     videoHeight: el.videoHeight,
//   };

//   console.log({ meta });
//   setVideoMeta(meta);
//   const thumbnails = await getThumbnails(meta);
//   setThumbnails(thumbnails);
// };


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