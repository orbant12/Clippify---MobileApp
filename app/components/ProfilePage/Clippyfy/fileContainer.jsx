//<********************************************>
//LAST EDITED: 2023.12.05
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the file container component for the Clip Saveing page
//<********************************************>

//BASIC IMPORTS
import { View, Text, Image,Pressable } from 'react-native';

const FileContainer = ({
    navigation,
    item
}) => {
return(
<Pressable onPress={() => navigation.navigate("ClipPage",
{data:item}
)}>
    <View key={item.id} style={{padding:30,flexDirection:"row",borderWidth:2,margin:10,borderRadius:20,}}>
        <Image
            source={{uri: `${item.img}`}}
            style={{width: 150, height: 100,borderRadius:10}}         
        />
        <View style={{flexDirection:"column",height:100,justifyContent:"space-evenly",marginLeft:20}}>
            <Text style={{fontWeight:"600",fontSize:18,maxWidth:130}} numberOfLines={1}>{item.title}</Text>
            <Text style={{fontWeight:"400",fontSize:15}}>Related : {item.related_count}</Text>
            <Text style={{fontWeight:"500",fontSize:15}}>Tag: {item.tag}</Text>
        </View>                  
    </View>
</Pressable>
)
}

export default FileContainer;