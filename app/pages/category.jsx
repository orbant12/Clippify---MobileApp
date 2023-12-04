//LAST EDITED DATE: 2023.12.03
//EDITED BY: Orban Tamas
//DESCRIPTION: This is the category page, where the user can choose from the categories

//COMPONENTS
import React from 'react';
import { ScrollView, StyleSheet, TextInput, View,Text,ImageBackground,Pressable } from 'react-native';

//CATEGORY IMAGES
import news from "../../assets/images/Health.png"
import sport from "../../assets/images/4.png"
import talk from "../../assets/images/10.png"
import health from "../../assets/images/6.png"
import gaming from "../../assets/images/3.png"
import fitness from "../../assets/images/5.png"
import solo from "../../assets/images/7.png"
import history from "../../assets/images/8.png"
import comedy from "../../assets/images/9.png"
import science from "../../assets/images/Science.png"

export default function TabTwoScreen({navigation}) {

//<********************VARIABLES************************>

//<********************FUNCTIONS************************>

//NAVIGATION LOGIC | CATEEGORY INPUT
const handleNavigation = (type) => {
  navigation.navigate('SelectedCategoryPage', { category: type,navigation:navigation });
}

return (
<ScrollView>
  <View style={styles.container}>
    <TextInput
      style={styles.searchBar}
      placeholder="Search..."
    />

    <View style={styles.gridContainer}>
      {/* Row 1 */}
      <View style={styles.gridRow}>
        {/* Health */}
        <ImageBackground
          source={health}
          style={styles.gridImage}      
        >
          <Pressable onPress={ () => handleNavigation("Health") }>
            <Text style={styles.gridText}>Health</Text>
          </Pressable>
        </ImageBackground>
  
        {/* News */}
        <ImageBackground
          source={news}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("News") }>
            <Text style={styles.gridText}>News</Text>
          </Pressable>
        </ImageBackground>
        
      </View>

      {/* Row 2 */}
      <View style={styles.gridRow}>
        <ImageBackground
          source={talk}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Talking") }>
            <Text style={styles.gridText}>Talking</Text>
          </Pressable>
        </ImageBackground>

        <ImageBackground
          source={solo}
          style={styles.gridImage}
          blurRadius={0.2}
        >
          <Pressable onPress={ () => handleNavigation("Solo") }>
            <Text style={styles.gridText}>Solo</Text>
          </Pressable>
        </ImageBackground>
          
      </View>

      {/* Row 3 */}
      <View style={styles.gridRow}>
        <ImageBackground
            source={science}
            style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Business") }>
            <Text style={styles.gridText}>Business</Text>
          </Pressable>
        </ImageBackground>

        <ImageBackground
          source={comedy}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Comedy") }>
            <Text style={styles.gridText}>Comedy</Text>
          </Pressable>
        </ImageBackground>
      </View>

      {/* Row 4 */}
      <View style={styles.gridRow}>
        <ImageBackground
          source={science}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Science") }>
            <Text style={styles.gridText}>Science</Text>
          </Pressable>
        </ImageBackground>
          
        <ImageBackground
          source={science}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Gaming") }>
            <Text style={styles.gridText}>Gaming</Text>
          </Pressable>
        </ImageBackground>
      </View>

      {/* Row 5 */}
      <View style={styles.gridRow}>
        <ImageBackground
          source={sport}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Sport") }>
            <Text style={styles.gridText}>Sport</Text>
          </Pressable>
        </ImageBackground>
        
        <ImageBackground
          source={gaming}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Gaming") }>
            <Text style={styles.gridText}>Gaming</Text>
          </Pressable>
        </ImageBackground>
      </View>

      {/* Row 6 */}
      <View style={styles.gridRow}>
        <ImageBackground
          source={fitness}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("Fitness") }>
            <Text style={styles.gridText}>Fitness</Text>
          </Pressable>
        </ImageBackground>
          
        <ImageBackground
          source={history}
          style={styles.gridImage}
        >
          <Pressable onPress={ () => handleNavigation("History") }>
            <Text style={styles.gridText}>History</Text>
          </Pressable>
        </ImageBackground>
      </View>

    </View>
  </View>
</ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  searchBar: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    width: '80%',
    marginVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  gridContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '80%', // Set the width of the grid container
    marginTop:20
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    flex: 1,
    aspectRatio: 1, // To make the boxes square
    backgroundColor: `url('https://picsum.photos/seed/picsum/200')`,
    marginHorizontal: 5,
    width: '48%', // Adjusted width to accommodate spacing
  },
  gridText:{
    fontSize: 20,
    fontWeight: "800",
    color: "#fff",
    marginTop:50,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  gridImage:{
   flex: 1, 
   aspectRatio: 1,
    marginVertical: 10,
    marginHorizontal: 10,
    width: '100%',
    borderColor:"balck",
    borderWidth: 2,
    blurRadius:10,
    

  }
});
