import { View,Text,StyleSheet,Pressable } from "react-native"


const FolderCard = ({ props,navigation }) => {

    const handleNavigation = (props) => {
        navigation.navigate("FolderPage",{data:props})
    }

return(
<Pressable onPress={()=> handleNavigation(props)}>
    <View style={styles.boxContainer}>
        <View>
            <Text style={styles.title}>
                {props.title}
            </Text>
            <Text style={{ color:"white",}}>
                Files: {props.files_count}
            </Text>
        </View>
        <View style={{padding:20,backgroundColor:`${props.color}`,position:"absolute",right:0,top:0,borderBottomLeftRadius:20}} />
    </View>
</Pressable>
)
}

const styles = StyleSheet.create({
    boxContainer: {
        width: 300,
        height: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#9effb1',
        justifyContent: 'space-between',
        padding: 10,
        borderWidth: 1,
        flexDirection: 'row',
        margin: 10,
        borderTopRightRadius:0,
    },
    title:{
        fontSize:20,
        color:"white",
        fontWeight:"bold"
    }
})


export default FolderCard;