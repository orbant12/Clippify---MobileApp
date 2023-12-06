//<***********************************>
//LAST EDITED: 2023.12.06
//EDITED BY: Orban Tamas
//DESC: This is a component, for chat messages, used in the AI chat page
//<***********************************>

//BASIC IMPORTS
import { View, Text, Image } from 'react-native';

const ChatMessage = ({ message}) => {
return(
<View style={{flexDirection:"row",width:"100%",marginTop:0,alignItems:"center",borderWidth:1,padding:10}}>
    <Image
        source={{uri:"https://picsum.photos/200/300"}}
        style={{width:50,height:50,borderRadius:50}}
    />
    <Text style={{marginLeft:15,maxWidth:300}}>
        {message.message}
    </Text>
</View>
)
};

export default ChatMessage;