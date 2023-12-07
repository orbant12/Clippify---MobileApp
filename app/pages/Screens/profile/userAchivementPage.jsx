
//BASIC IMPORTS
import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import React from 'react';

const AchivementPage = () => {

return(
<View>

    {/* ACHIVEMENT 1 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:20,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly",width:"100%",marginBottom:10}}>
            <View style={{justifyContent:"space-between",height:90}}>
                <Text>Todo 1</Text>
                <Text>Todo 2</Text>
                <Text>Todo 3</Text>
            </View>        
            <Image
                style={{width: 100, height: 100,marginTop:10,borderWidth:1,borderColor:"red",borderRadius:10}}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
        </View>
        
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
    {/* ACHIVEMENT 2 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:20,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly",width:"100%",marginBottom:10}}>
            <View style={{justifyContent:"space-between",height:90}}>
                <Text>Todo 1</Text>
                <Text>Todo 2</Text>
                <Text>Todo 3</Text>
            </View>        
            <Image
                style={{width: 100, height: 100,marginTop:10,borderWidth:1,borderColor:"red",borderRadius:10}}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
        </View>
        
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
    {/* ACHIVEMENT 3 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:20,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-evenly",width:"100%",marginBottom:10}}>
            <View style={{justifyContent:"space-between",height:90}}>
                <Text>Todo 1</Text>
                <Text>Todo 2</Text>
                <Text>Todo 3</Text>
            </View>        
            <Image
                style={{width: 100, height: 100,marginTop:10,borderWidth:1,borderColor:"red",borderRadius:10}}
                source={{uri: 'https://reactnative.dev/img/tiny_logo.png'}}
            />
        </View>
        
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
</View>
)}

const styles = StyleSheet.create({
    achivementContainer:{
        width:"80%",
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"white",
        alignItems:"center",
        borderWidth:1,
        borderColor:"red",
        borderRadius:15,
        height:250,
        marginTop:30,
    },
    collectBTN:{
        backgroundColor:"blue",
        padding:10,
        borderRadius:10,
        marginTop:15,
        marginBottom:10,
        opacity:0.3
    }
})

export default AchivementPage;