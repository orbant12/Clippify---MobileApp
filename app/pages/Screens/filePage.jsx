//<********************************************>
//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the page that displays the Saved Clip , Notes , Transcript , Related Files
//<********************************************>


//REACT
import React,{useEffect, useState} from "react";

//COMPONENTS
import { View,Text,StyleSheet,TouchableHighlight,ScrollView,TextInput } from "react-native";
import {Video} from "expo-av";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import TempScreen from "../../components/ProfilePage/Clippyfy/richTextEditor";
import FileContainer from "../../components/ProfilePage/Clippyfy/fileContainer";
import {BottomSheetModal,BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import ChatMessage from "../../components/ProfilePage/Clippyfy/chatLog";

//FIREBASE
import {  ref, getDownloadURL } from "firebase/storage";
import {  collection, getDocs } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import {storage,db,app} from "../../firebase"

//CONTEXT
import { useAuth } from "../../context/UserAuthContext";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import "react-native-gesture-handler";


const FilePage = ({route}) => {

//<***********************VARIABLES**********************>

//PAGE DATA
const pageData = route.params.data

//AUTH
const {currentuser} = useAuth()

//FIREBASE HTTP REQUEST
const functions = getFunctions(app);

//Bottom Sheet 
const bottomSheetRef = React.useRef(null);
const snapPoints = ['40%','70%','100%']

// Bottom Sheet Ai State
const [isAiOpenned,setIsAiOpenned] = React.useState(false)

//AI First Question Display
const [isFirstQuestion,setIsFirstQuestion] = React.useState(true)

//RELATED FILES ARRAY
const [relatedFileList,setRelatedFileList] = React.useState([])

//ANALISING SCRIPT LOGIC
const [analisingIsLoading,setAnalisingIsLoading] = useState(false)
const [analisingMode,setAnalisingMode] = useState(false)


//Ai INPUT
const [aiInput,setAiInput] = React.useState("")

//AI QUESTION LOADING
const [questionLoading,setQuestionLoading] = React.useState(false)

//AI CHAT LOG
const [chatLog,setChatLog] = React.useState([])

//TRANSCRIPT SCRIPT
const [transcriptScript,setTranscriptScript] = useState("")

//SUMMERISING LOADING
const [summerisingIsLoading,setSummerisingIsLoading] = useState(false)


//<***********************FUNCTIONS**********************>

//RELATED BOTTOM SHEET | Open
const handleRelatedBottomSheetOpen = () => {
    bottomSheetRef.current.present();
}

//AI INPUT | SETT
const handleAiInput = (text) => {
    setAiInput(text)
}


//HTTP REQUEST | OPENAI
const generateTextFromPrompt = async (request) => {
    const generateTextFunction = httpsCallable(functions, 'openAIHttpFunctionSec');
    let chatLogNew = [...chatLog, {user: "me", message: `${request}`} ]
    try {
        console.log(request)
        const result = await generateTextFunction({name: request});
        //SETT LOADING FALSE
        setChatLog([...chatLogNew, {user: "gpt", message: `${result.data.data.choices[0].message.content}`}])
        setSummerisingIsLoading(false)
        setQuestionLoading(false)
    } catch (error) {
        console.error('Firebase function invocation failed:', error);
    }
};

//FOCUS BOTTOM | PROMPT ASK
const handleFocusBottom = () => {
    bottomSheetRef.current.snapToIndex(1)

}

//TRANSCRIPT LOAD
const handleScriptLoading = async () =>{
    const audioMetaName = `${pageData.storage_path_audio + ".wav_transcription.txt"}` //STORAGE_PATH_AUDIO
    const transRef = ref(storage,audioMetaName)
    const transcription = await getDownloadURL(transRef)
    console.log(transcription)
    try{
        fetch(transcription)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Parse the response as JSON
        })
        .then(data => {
            const querySnaphot = data.results // This will log the JSON data
            const userFolders = [];
            querySnaphot.forEach((doc) => {
            // Extract folder data and add it to the userFolders array
                userFolders.push(doc.alternatives[0].transcript);
            });
            const concatenatedText = userFolders.map(doc => doc).join(' ');
            setTranscriptScript(concatenatedText)
            // You can now work with the JSON data as needed
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        }); 
    } catch (error) {
        console.error('Firebase function invocation failed:', error);
    }
}

//PROMPT ENTER | SEND
const handleEnterPress = (e) => { 
    if (questionLoading == false){
        setIsFirstQuestion(false)
        bottomSheetRef.current.snapToIndex(2)
        // Do something when Enter is pressed, e.g., trigger a function or submit a form
        e.preventDefault();
        setQuestionLoading(true)

    if(analisingMode === true){
        //QUESTION WITH TRANSCRIPT
        const  question = "( " + transcriptScript + " )" + "this is a video script," + " " + aiInput;
        //SETT CHATLOG WITH THE MESSAGE
        let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
        //SETT GPT LOADING
        setChatLog([...chatLogNew, {user: "gpt", message: "Loadin...."}]);
        //FINSIH QUESTION
        console.log('question:', question); 
        //FUNCTION EVENT
        generateTextFromPrompt(question)
        setAnalisingMode(false)

    }else if (analisingMode !== true) {
        const  question =  aiInput;
        let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
        //Loading GPT
        setChatLog([...chatLogNew, {user: "gpt", message: "Loadin...."}]);
        //FINSIH QUESTION
        console.log('question:', question); 
        //FUNCTION EVENT
        generateTextFromPrompt(question);

    }

    //FIRST QUESTION LOGIC
    setIsFirstQuestion(false)
    //BACK TO DEFAULTS
    setAiInput("")

    } else {
        alert("Wait for the answer !")
    }
};

//SUMMERISING LOGIC | TRIIGGER
const handleSummerising = async () =>{
    setSummerisingIsLoading(true)
    setQuestionLoading(true)
    await handleScriptLoading()
    const summeriseFunction = () => {
        const  question = "( " + transcriptScript + " )" + " summerise this video script";
        //SETT CHATLOG WITH THE MESSAGE
        let chatLogNew = [...chatLog, {user: "me", message: `${question}`} ];
        setChatLog([...chatLogNew, {user: "gpt", message: "Loadin...."}]);
        generateTextFromPrompt(question);
        setIsFirstQuestion(false)
        setTranscriptScript("")
        // You can now work with the JSON data as needed
    }
    summeriseFunction() 
}


//ANALISING SCRIPT | LOAD
const handleAnaliseScriptLoad = async () =>{
    if(analisingMode == false){
        if(analisingIsLoading == false){
            setAnalisingIsLoading(true)
            if(transcriptScript == ""){
                await handleScriptLoading().then(() => {
                    setAnalisingIsLoading(false)
                    setAnalisingMode(true)
                })
            } else {
                setAnalisingIsLoading(false)
                setAnalisingMode(true)
            }
        } else {
            alert("Analasis Still in Laod..")
        }
    }else{
        setAnalisingIsLoading(false)
        setAnalisingMode(false)
    }
}

//RELATED FILES | FETCH
const fetchRelatedFiles = async () => {
    if(currentuser){
        const relatedRef = collection(db,"users",currentuser.uid,"File-Storage",pageData.folder_id,"Files",pageData.id,"Children")
        const relatedSnap = await getDocs(relatedRef)
        const relatedList = relatedSnap.docs.map(doc => doc.data())
        setRelatedFileList(relatedList)
    }
}

//ON LOAD
useEffect(() => {
    //1.) FETCH RELATED FILES
    fetchRelatedFiles()
},[])


return(

<GestureHandlerRootView style={{ flex: 1 }}>
    <BottomSheetModalProvider>
        <ScrollView>
            {/* Screen Container */}
            <View style={styles.container}>
                {/* Video Frame */}
                <View>
                    <Video
                        source={{uri: `${pageData.url}`}}
                        style={styles.video}
                        resizeMode={'cover'}
                        isLooping={true}
                        shouldPlay={true}
                        useNativeControls={true}
                            
                    />
                </View>
                {/* Feature Buttons */}
                <View style={{flexDirection:"row",justifyContent:"space-evenly",width:"55%",marginTop:20}}>
                    <TouchableHighlight onPress={() => {handleRelatedBottomSheetOpen();setIsAiOpenned(true)}}>
                        <MaterialCommunityIcons
                            name="robot"
                            size={25}
                            color="black"
                            style={{padding:8,borderWidth:1,borderRadius:10}}
                        />
                    </TouchableHighlight>
                    <TouchableHighlight onPress={() => {handleRelatedBottomSheetOpen();setIsAiOpenned(false)}}>
                        <MaterialCommunityIcons
                            name="video-plus"
                            size={25}
                            color="black"
                            style={{padding:8,borderWidth:1,borderRadius:10}}
                        />
                    </TouchableHighlight>
                </View>
                {/* Rich Text Editor */}
                <View>
                    <TempScreen />
                </View>

            </View>
        </ScrollView>
        {/* Bottom Sheet */}
        <BottomSheetModal
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose={true}
            handleIndicatorStyle={{backgroundColor:"black"}}
            handleStyle={{backgroundColor:"white"}}  
        >
        {!isAiOpenned ? (
            <>
                {/* Sheet | RELATED FILES */}
                <ScrollView style={{height:"auto"}} >   
                {relatedFileList.length > 0 ? (
                    <>
                        {/* Sheet Title */}
                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",width:"100%",marginBottom:15}}>
                            <Text style={{fontSize:16,fontWeight:"600"}}>Related Files</Text>
                        </View>
                        {/* Sheet Content | RELATED FILES */}
                        {relatedFileList.map((file) => (
                            <FileContainer  item={file} />
                        ))}
                    </>
                ):(
                <>
                    {/* No Files Avalible */}
                    <View style={{alignItems:"center"}}>
                        <View style={{flexDirection:"row",alignItems:"flex-start",justifyContent:"space-between",width:"100%"}}>
                            <Text style={{marginLeft:20,marginTop:20,fontSize:16,fontWeight:"600"}}>Related Clips</Text> 
                        </View>
                        <Text style={{opacity:0.6,fontSize:18,marginTop:40}}>No Clips Saved</Text>
                    </View>
                </>
                )}
                </ScrollView>
            </>
        ):(
        isFirstQuestion ? (
            <View style={{ flex:1,borderTopWidth:1}}>
                {/* Ai First Question | Title */}
                <View style={{alignItems:"center",marginTop:10, borderBottomWidth:2,paddingBottom:8,width:"60%",marginLeft:"auto",marginRight:"auto"}}>
                    <Text style ={{fontWeight:600,fontSize:20}}>
                        Welcome To Clippify Ai
                    </Text>
                </View>
                {/* Ai First Question | Content */}
                <View style={{marginTop:1}} >
                    {/* Feature Buttons */}
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",width:"80%",marginRight:"auto",marginLeft:"auto"}}>
                    <TouchableHighlight onPress={handleSummerising} >
                        {!summerisingIsLoading ? (
                        
                        <Text style={styles.featureButton}>
                            Summerise
                        </Text>
                        
                        ):(
                        <Text style={styles.featureButtonActive}>
                            Processing...
                        </Text>
                        )}
                    </TouchableHighlight>

                    <TouchableHighlight onPress={handleAnaliseScriptLoad}>
                    {!analisingIsLoading ? (
                        
                        !analisingMode ? (
                        <Text style={styles.featureButton}>
                            Analise Script
                        </Text>
                        ):(

                        <Text style={styles.featureButtonActive}>
                            Script Loaded
                        </Text>
                        )
                        
                        
                        ):(
                        <Text style={styles.featureButtonActive}>
                            Loading...
                        </Text>
                        )}
                                    
                                </TouchableHighlight>
                    </View>
                    {/* Input Bar */}
                    <TextInput onFocus={handleFocusBottom} onSubmitEditing={handleEnterPress} onChangeText={handleAiInput} style={{fontSize:17,borderWidth:3,borderRadius:30,marginTop:20,width:"80%",marginLeft:"auto",marginRight:"auto",padding:15}} placeholder="Ask anything you want !" />
                </View>
            </View>
        ):( 
            <View style={{ flex:1,borderTopWidth:1}}>
                {/* Ai Secound Page | Title */}
                <View style={{alignItems:"center",marginTop:10, borderBottomWidth:2,paddingBottom:8,width:"25%",marginLeft:"auto",marginRight:"auto"}}>
                    <Text style ={{fontWeight:600,fontSize:20}}>
                        Chat Log
                    </Text>
                </View>
                {/* Ai Secound Page | Content */}
                <ScrollView style={{height:100,marginTop:20}}>
                    {chatLog.map((message,index) => (
                        <ChatMessage message={message} key={index} />
                    ))}
                </ScrollView>
                {/* Ai Secound Page | Input Bar */}
                <View style={{marginTop:1,marginBottom:50}} >
                    <View style={{flexDirection:"row",justifyContent:"space-evenly",width:"80%",marginRight:"auto",marginLeft:"auto"}}>
                        <TouchableHighlight onPress={handleSummerising} >
                        {!summerisingIsLoading ? (
                            <Text style={styles.featureButton}>
                                Summerise
                            </Text>
                        ):(
                            <Text style={styles.featureButtonActive}>
                                Summering
                            </Text>
                        )}
                        </TouchableHighlight>
                        <TouchableHighlight onPress={handleAnaliseScriptLoad}>
                        {!analisingIsLoading ? (
                            !analisingMode ? (
                                <Text style={styles.featureButton}>
                                    Analise Script
                                </Text>
                            ):(
                                <Text style={styles.featureButtonActive}>
                                    Script Loaded
                                </Text>
                            )
                        ):(
                            <Text style={styles.featureButtonActive}>
                                Loading...
                            </Text>
                        )}
                        </TouchableHighlight>
                    </View>
                    <TextInput value={aiInput}  onSubmitEditing={handleEnterPress} onChangeText={handleAiInput} style={{fontSize:17,borderWidth:3,borderRadius:30,marginTop:20,width:"80%",marginLeft:"auto",marginRight:"auto",padding:15}} placeholder="Ask anything you want !" />
                </View>
            </View>
        ))}
        </BottomSheetModal>
    </BottomSheetModalProvider>
</GestureHandlerRootView>
)    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
    },
    video:{
            width: '100%',
            aspectRatio: 16 / 9,
    },
    featureButton:{
        backgroundColor:"transparent",
        color:"black",
        padding:14,
        borderRadius:10,
        marginTop:20,
        fontSize:12,
        fontWeight:"600",
        borderWidth:2,
        width:120,
        textAlign:"center"
    },
    featureButtonActive:{
        backgroundColor:"black",
        color:"white",
        padding:14,
        borderRadius:10,
        marginTop:20,
        fontSize:12,
        fontWeight:"600",
        borderWidth:2,
        width:120,
        textAlign:"center"
    }
});

export default FilePage;