//<***************************************************>
//LAST EDITED : 2023.12.06
//EDITED BY : ORBAN TAMAS
// Desc: This file contains the VideoContainer component
//<***************************************************>


// Import
import { View, Text, Image } from 'react-native';

const VideoContainer = ({
    item
}) => {
return(
<View key={item.id} style={{padding:30,flexDirection:"row",borderWidth:2,margin:10,borderRadius:20,}}>
    <Image
        source={{uri: `${item.thubnail}`}}
        style={{width: 150, height: 100,borderRadius:10}}
    />
    <View style={{flexDirection:"column",height:100,justifyContent:"space-evenly",marginLeft:20}}>
        <Text style={{fontWeight:"600",fontSize:18,maxWidth:130}} numberOfLines={2}>{item.title}</Text>
        {/* <Text style={{fontWeight:"400",fontSize:15}}>Related : {item.related_count}</Text>
        <Text style={{fontWeight:"500",fontSize:15}}>Tag: {item.tag}</Text> */}
    </View>
    
</View>
)
}

export default VideoContainer;