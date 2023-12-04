import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "./app/pages/login";
import UserAuthContext from "./app/context/UserAuthContext";
import TabOneScreen from "./app/pages/home";
import HomeBottomTabNavigator from "./app/navigation/homeBottomTabNavigation";
import VideoPage from "./app/pages/Screens/videoDisplay";
import FilePage from "./app/pages/Screens/filePage";
import SelectedCategoryPage from "./app/pages/Screens/selectedCategory";


const Stack = createNativeStackNavigator();

export default function App() {
    return (
      
        <NavigationContainer>
          <UserAuthContext>
            <Stack.Navigator initialRouteName="LoginPage">
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown:false}} />
                <Stack.Screen name="Home" component={HomeBottomTabNavigator} options={{ headerShown:false}} />
               
                <Stack.Screen name="Video" component={VideoPage} options={{ headerShown:false}} />
                <Stack.Screen name="ClipPage" component={FilePage}   options={({ route }) => ({ title: route.params.data.title })} />
                <Stack.Screen name="SelectedCategoryPage" component={SelectedCategoryPage}   options={({ route }) => ({ title: route.params.category })} />
    
            </ Stack.Navigator>
      

            </UserAuthContext>
        </NavigationContainer>
     
    )
}