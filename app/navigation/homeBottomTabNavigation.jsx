//<********************************************>
//LAST EDITED: 2023.12.04
//EDITED BY: Orban Tamas
//DESC: This is the bottom tab navigation for the home page. It contains the following tabs: Home, Search, Upload, Inbox, Profile
//<********************************************>

//BASIC IMPORTS
import React,{useState} from 'react';
import {Image, Text,View,TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//COMPONENTS
import TabOneScreen from '../pages/home';
import ForYouPage from '../pages/forYou';
import TabTwoScreen from '../pages/category';
import UploadPage from '../pages/upload';
import Inbox from '../pages/inbox';
import Profile from '../pages/profile';


//ICONS
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LupodyLogo from "../../assets/images/LupodyPNG.png"
import plusIcon from '../../assets/favicon.png';
import { Icon } from 'react-native-elements';

//NAVIGATION TAB CREATION
const Tab = createBottomTabNavigator();


const HomeBottomTabNavigator = ({navigation}) => {

//<**********************FUNCTIONS******************************>

//SETTINGS NAVIGATION
const handleSettingsNavigation = () => {
  navigation.navigate("SettingsPage")
}

//<**********************VARIABLES******************************>
const [isExplore,setIsExplore] = useState(true);

return (
  <Tab.Navigator
    tabBarOptions={{
      tabStyle: {
        backgroundColor: '#fff',
      },
      activeTintColor: '#000',
    }}>
      {/* HOME NAVIGATION */}
      <Tab.Screen
        name={'Home'}
        component={isExplore ? TabOneScreen : ForYouPage}
        options={{
          headerShown: true,
          headerTransparent: true,
          header : () => (
          <>
            <View style={{marginTop:60,marginLeft:95,marginRight:"auto",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",width:"50%",zIndex:5}}>
              <TouchableOpacity onPress={() => setIsExplore(true)} style={isExplore? {borderBottomColor:"black",borderBottomWidth:2} : {}}>
                <Text style={isExplore?{fontWeight:"800"}:{opacity:0.4,fontWeight:800,color:"black"}}>Home</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setIsExplore(false)} style={!isExplore? {borderBottomColor:"black",borderBottomWidth:2} : {}}>
                <Text style={isExplore?{opacity:0.4,fontWeight:800,color:"black"}:{fontWeight:"800"}}>Folders</Text>
              </TouchableOpacity>
              <View style={{position:"absolute",marginLeft:200,marginRight:0}}>
                <Icon
                  name='notifications'
                  type='material'
                  color='black'
                  size={25}
                  onPress={() => navigation.navigate("Inbox")}
                />
              </View>
            </View>
          </>
          ),
          tabBarIcon: ({color}) => (
            <Entypo name={'home'} size={25} color={color} />
          ),
        }}
      />

      {/* UPLOAD NAVIGATION */}
      <Tab.Screen
        name={'Upload'}
        component={UploadPage}
        options={{
          headerShown: false,
          header: () => (
            <View style={{flexDirection:"row",justifyContent:"space-between",marginRight:30,marginLeft:30,alignItems:"center",marginTop:40}}>
              <Image
                style={{width: 100, height: 50}}
                source={require('../../assets/images/lupo.png')}
              />  
              <Icon
                name='notifications'
                type='material'
                color='black'
                size={25}
              />
            </View>
          ),
          tabBarIcon: ({color}) => (
            <Entypo name={'plus'} size={25} color={color} />
          ),
          tabBarLabel: () => null,
        }}
      />
      {/* PROFILE NAVIGATION */}
      <Tab.Screen
        name={'Profile'}
        component={Profile}
        options={{
          headerShown:true,
          headerTransparent:false,
          header: () => (
            <View style={{width:"100%",backgroundColor:"white",paddingTop:40,paddingBottom:10}} >
              <View style={{alignItems:"flex-end",width:"100%"}}>           
                  <TouchableOpacity style={{marginRight:30}} onPress={handleSettingsNavigation}>
                    <Icon
                      name='menu'
                      type='material'
                      color='black'
                      size={25}
                    />
                  </TouchableOpacity>
              </View>
            </View>
          ),
          tabBarIcon: ({color}) => (
            <Ionicons name={'person-outline'} size={25} color={color} />
          ),
        }}
  />
  </Tab.Navigator>
  );
};

export default HomeBottomTabNavigator;