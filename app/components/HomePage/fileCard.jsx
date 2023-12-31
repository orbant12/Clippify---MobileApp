import { View,Text,StyleSheet,Image, Pressable } from "react-native"


const FileCard = ({ navigation,props }) => {

    const handleNavigation = (props) => {
        navigation.navigate("ClipPage",{data:props})
    }

return(
<Pressable onPress={()=> handleNavigation(props)}>
<View style={styles.boxContainer}>
    <Image
        style={{width: 100, height: 100}}
        source={{uri: props.img}}
    />
    <View>
        <Text>
            {props.title}
        </Text>
        <Text>
            {props.related_count}
        </Text>
        <Text>
            Tag: {props.tag}
        </Text>
    </View>
    <Text>8MB</Text>
</View>
</Pressable>
)
}

const styles = StyleSheet.create({
    boxContainer: {
        width: "100%",
        marginRight:"auto",
        marginLeft:"auto",
        height: 130,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        justifyContent: 'space-between',
        padding: 10,
        borderTopWidth: 1,
        borderBottomWidth:1,
        flexDirection: 'row',
        margin: 10,
    },
})


export default FileCard;