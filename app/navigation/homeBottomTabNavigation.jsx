import React,{useState} from 'react';
import {Image, Text,View,TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabOneScreen from '../pages/home';
import ForYouPage from '../pages/forYou';
import TabTwoScreen from '../pages/category';
import UploadPage from '../pages/upload';
import Inbox from '../pages/inbox';
import Profile from '../pages/profile';

import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LupodyLogo from "../../assets/images/LupodyPNG.png"


import plusIcon from '../../assets/favicon.png';
import { Icon } from 'react-native-elements';

const Tab = createBottomTabNavigator();

const HomeBottomTabNavigator = () => {

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
            <View style={{position:"absolute",marginLeft:0,left:0,marginTop:45}}>
              <Image
                style={{ width: 100, height: 50}}
                source={require('../../assets/images/lupo.png')}
              />
            </View>

            <View style={{marginTop:60,marginLeft:95,marginRight:"auto",flexDirection:"row",justifyContent:"space-evenly",alignItems:"center",width:"50%",zIndex:5}}>
              <TouchableOpacity onPress={() => setIsExplore(true)} style={isExplore? {borderBottomColor:"black",borderBottomWidth:2} : {}}>
                <Text style={isExplore?{fontWeight:"800"}:{opacity:0.4,fontWeight:800,color:"black"}}>Explore</Text>
              </TouchableOpacity>
         
              <TouchableOpacity onPress={() => setIsExplore(false)} style={!isExplore? {borderBottomColor:"black",borderBottomWidth:2} : {}}>
                <Text style={isExplore?{opacity:0.4,fontWeight:800,color:"black"}:{fontWeight:"800"}}>For You</Text>
              </TouchableOpacity>
              <View style={{position:"absolute",marginLeft:200,marginRight:0}}>
                <Icon
                  name='notifications'
                  type='material'
                  color='black'
                  size={25}
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

      {/* SEARCH NAVIGATION */}
      <Tab.Screen
        name={'Search'}
        component={TabTwoScreen}
        options={{
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
            <AntDesign name={'search1'} size={25} color={color} />
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
          tabBarIcon: ({}) => (
            <Image
              source={plusIcon}
              style={{height: 35, resizeMode: 'contain'}}
            />
          ),
          tabBarLabel: () => null,
        }}
      />
      {/* INBOX NAVIGATION */}
      <Tab.Screen
        name={'Inbox'}
        component={Inbox}
        options={{
          headerShown: false,
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons
              name={'message-minus-outline'}
              size={25}
              color={color}
            />
          ),
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
              <View style={{flexDirection:"row-reverse",justifyContent:"space-between",marginRight:30,marginLeft:30,alignItems:"center",width:"50%"}}>
                <Text >Admin 1</Text>  
                  <TouchableOpacity onPress={() => na}>
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