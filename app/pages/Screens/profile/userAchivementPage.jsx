
//BASIC IMPORTS
import { View,Text,StyleSheet,Image,TouchableOpacity } from "react-native"
import React from 'react';

const AchivementPage = () => {

return(
<View>
    <View>
        <Text style={{fontSize:30,fontWeight:"600",marginLeft:20,marginTop:20}}>Achivements</Text>
    </View>
    {/* ACHIVEMENT 1 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:30,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <Text>Todo 1</Text>
        <Text>Todo 2</Text>
        <Text>Todo 3</Text>
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
    {/* ACHIVEMENT 2 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:30,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <Text>Todo 1</Text>
        <Text>Todo 2</Text>
        <Text>Todo 3</Text>
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
    {/* ACHIVEMENT 3 */}
    <View style={styles.achivementContainer}>
        <Text style={{marginBottom:30,marginTop:30,fontWeight:"600"}}>Achivement Name</Text>
        <Text>Todo 1</Text>
        <Text>Todo 2</Text>
        <Text>Todo 3</Text>
        <TouchableOpacity style={styles.collectBTN}>
            <Text style={{color:"white"}}>Collect</Text>
        </TouchableOpacity>
    </View>
</View>
)}

const styles = StyleSheet.create({
    achivementContainer:{
        width:"60%",
        marginLeft:"auto",
        marginRight:"auto",
        backgroundColor:"white",

        alignItems:"center",
        borderWidth:1,
        borderRadius:15,
        height:200,
        marginTop:30,
    },
    collectBTN:{
        backgroundColor:"blue",
        padding:10,
        borderRadius:10,
        marginTop:15,
        marginBottom:10,
    }
})

export default AchivementPage;