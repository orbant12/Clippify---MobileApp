//<********************************************>
//LAST EDITED DATE: 2023.12.06
//EDITED BY: Orban Tamas
//DESCRIPTION: This is a component for the inbox page, it is a singe mail with passed data
//<********************************************>

//BASIC IMPORTS
import { View,Text} from "react-native";

//ICONS
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const MailRow = () => {
return(        
<View style={{flexDirection:"row",padding:20,width:"100%",justifyContent:"space-between",alignItems:"center",borderWidth: 1,borderColor: '#eee',}}>
    <MaterialCommunityIcons
        name="alert"
        size={20}
        color="black"
    />
    <Text numberOfLines={3} ellipsizeMode="tail" style={{maxWidth:200}}>Alerndfjnfjdnfjdnfj  sdsd s ds sd s dsd sd sdsdsdssdjnsdjsdjhsjodjiosn shjo dikos djs njdnjndj sn</Text>
    <Text>2023.11.17</Text>
</View>
)};

export default MailRow;