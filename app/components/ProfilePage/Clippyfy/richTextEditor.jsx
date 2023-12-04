

import React from "react";
import { Text, Platform, KeyboardAvoidingView, SafeAreaView, ScrollView,View } from "react-native";
import {actions, RichEditor, RichToolbar} from "react-native-pell-rich-editor";


const handleHead = ({tintColor}) => <Text style={{color: tintColor}}>H1</Text>
const handleHead2 = ({tintColor}) => <Text style={{color: tintColor}}>P</Text>

const TempScreen = () => {
	const richText = React.useRef();
	return (
    <>
      <View style={{width:"100%",justifyContent:"space-between",marginTop:40,height:"100%"}}>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}	style={{ flex: 1 }}>
         
          <RichToolbar
        editor={richText}
        actions={[ actions.setBold, actions.setItalic, actions.setUnderline, actions.heading1,actions.heading3,actions.insertBulletsList,actions.insertOrderedList,actions.insertLink,actions.insertImage ]}
        iconMap={{ [actions.heading1]: handleHead,[actions.heading3]: handleHead2} }
        style={{backgroundColor:"white",borderWidth:2,borderTopLeftRadius:10,borderTopRightRadius:10}}
      />

      <ScrollView style={{height:"auto",borderWidth:2,minHeight:300}}>
          <RichEditor
              ref={richText}
              onChange={ descriptionText => {
                  console.log("descriptionText:", descriptionText);
              }}
              
          />
        </ScrollView>
        </KeyboardAvoidingView>
      </View>



</>
  
  );
};

export default TempScreen;