
import { View, Text,ScrollView } from 'react-native';

const UserSavedPage = () => {
return (
<View style={{backgroundColor:"gray"}}>
    <ScrollView horizontal>
        <View style={{flexDirection:"row",height:50,alignItems:"center"}}>
            <Text style={{marginLeft:20}}>Categories</Text>
            <View style={{marginLeft:20,borderLeftColor:"black",borderLeftWidth:1,padding:1,height:30}}></View>
            <Text style={{marginLeft:20,borderWidth:2,padding:5}} >Add New list +</Text>
        </View>
    </ScrollView>
</View>
)}

export default UserSavedPage;