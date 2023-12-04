
import React, { useState} from 'react';
import {View, TouchableWithoutFeedback, Text, Image, TouchableOpacity} from 'react-native';
import { Video } from 'expo-av';
import styles from './styles';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useAuth} from '../../context/UserAuthContext';
const ShortPost = ({post}) => {

const [isLiked, setIsLiked] = useState(false);
const [paused, setPaused] = useState(true);

const {currentuser} = useAuth();
const video = React.useRef(null);

const onPlayPausePress = () => {
    setPaused(!paused);
  };





return (
    <View style={styles.container}>
    <TouchableWithoutFeedback onPress={onPlayPausePress}>
      <View>
        <Video
            ref={video}
          source={{uri: post.intro}}
          style={styles.video}
          resizeMode={'cover'}
          isLooping={true}
          shouldPlay={paused}
            
        
        />

        <View style={styles.uiContainer}>
          <View style={styles.rightContainer}>
  

            <TouchableOpacity  style={styles.iconContainer} onPress={() => alert(`${currentuser.uid}`)}>
              <AntDesign name={'heart'} size={25} color={isLiked ? 'red' : 'white'} />
              <Text style={styles.statsLabel}>{"11"}</Text>
            </TouchableOpacity>

            <View style={styles.iconContainer}>
              <FontAwesome name={'commenting'} size={25} color="white" />
              <Text style={styles.statsLabel}>{"32"}</Text>
            </View>



            <View style={styles.iconContainer}>
              <Fontisto name={'share-a'} size={25} color="white" />
              <Text style={styles.statsLabel}>{"32"}</Text>
            </View>

            <View style={styles.iconContainer}>
              <FontAwesome name={'bookmark'} size={25} color="white" />
              <Text style={styles.statsLabel}>{"32"}</Text>
            </View>
          </View>

          <View style={styles.bottomContainer}>
            <View>
              <Text numberOfLines={2} ellipsizeMode='tail' style={styles.handle}>{post.title}</Text>
              <Text style={styles.description}>{post.description}</Text>

              <View style={styles.songRow}>
                <Entypo name={'eye'} size={24} color="white" />
                <Text style={styles.songName}>{post.uploader_fullname}</Text>
              </View>
            </View>

            <Image
              style={styles.songImage}
              source={{uri: post.uploader_avatar}}
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  </View>
);
};




export default ShortPost;