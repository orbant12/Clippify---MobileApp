//<********************************************>
//Last Update: 2023/12/04
//Edited by: Orban Tamas
//Desc: This is the main file of the application. It contains the navigation stack and the context provider.
//<********************************************>

//BASE IMPORTS
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//COMPONENTS
import LoginPage from "./app/pages/login";
import UserAuthContext from "./app/context/UserAuthContext";
import HomeBottomTabNavigator from "./app/navigation/homeBottomTabNavigation";
import VideoPage from "./app/pages/Screens/videoDisplay";
import FilePage from "./app/pages/Screens/filePage";
import SelectedCategoryPage from "./app/pages/Screens/selectedCategory";
import SettingsPage from "./app/pages/Screens/SettingsPage"
import GeneralSettings from "./app/pages/Screens/generalSettings/generalSettings"
import EpisodeEdit from "./app/pages/Screens/generalSettings/creatorSettings/episodeEdit"
import VisitedProfile from "./app/pages/Screens/visitedProfile"

//CREATING THE NAVIGATION STACK
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
            <Stack.Screen name="SettingsPage" component={SettingsPage} options={{ headerShown:true,title:"Settings"}} />
            <Stack.Screen name="GeneralSettings" component={GeneralSettings}   options={({ route }) => ({ title: route.params.data })} />
            <Stack.Screen name="EpisodeEdit" component={EpisodeEdit}   options={{ headerShown:true,title:"Manage Episodes"}} />
            <Stack.Screen name="VisitedProfile" component={VisitedProfile}   options={({ route }) => ({ title: route.params.data.uploader_fullname })} />
        </ Stack.Navigator>
    </UserAuthContext>
</NavigationContainer>   
)
}