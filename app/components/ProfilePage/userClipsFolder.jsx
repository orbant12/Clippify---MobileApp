
import { View, Text } from "react-native";

const UserClipsFolder = ({folderTitlePass,folderColorPass}) => {
    return(
        <View style={{flexDirection:"row",width:"100%",padding:20,borderBlockColor:"black",borderTopWidth:1,borderBottomWidth:2,backgroundColor:`${folderColorPass}`}}>
        <Text style={{fontWeight:"800"}}>{folderTitlePass}</Text>
    </View>
    )
}

export default UserClipsFolder;