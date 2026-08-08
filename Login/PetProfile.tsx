import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';



export default function PetProfileScreen(){

  return (

    <SafeAreaView style={styles.container}>


      {/* PET IMAGE */}

      <View style={styles.imageContainer}>


        <Image

          source={require('../assets/Login/LogoSignup.png')}

          style={styles.petImage}

          resizeMode="cover"

        />



        <TouchableOpacity style={styles.back}>

          <Text style={styles.backText}>
            ‹
          </Text>

        </TouchableOpacity>



        <TouchableOpacity style={styles.more}>

          <Text style={styles.moreText}>
            ⋮
          </Text>

        </TouchableOpacity>


      </View>







      {/* DETAILS CARD */}

      <View style={styles.card}>


        <View style={styles.titleRow}>


          <Text style={styles.petName}>
            Max, 4 years old
          </Text>


          <Ionicons

            name="create-outline"

            size={20}

            color="#16444A"

          />


        </View>







        <PetInfo
          title="Sex"
          value="Male"
        />


        <PetInfo
          title="Weight"
          value="34 kg"
        />


        <PetInfo
          title="Color"
          value="Brown"
        />


        <PetInfo
          title="Breed"
          value="Golden Retriever"
        />


        <PetInfo
          title="Food Type"
          value="Mixed of Wet and Dry"
        />


        <PetInfo
          title="Vitamins"
          value="N/A"
        />


        <PetInfo
          title="Medicine"
          value="N/A"
        />



        <View style={styles.row}>

          <Text style={styles.label}>
            Vaccine History
          </Text>


          <Text style={styles.link}>
            View image
          </Text>


        </View>



      </View>



    </SafeAreaView>

  );

}






function PetInfo({

 title,

 value

}:{

 title:string;

 value:string;

}){


return (

<View style={styles.row}>


<Text style={styles.label}>
{title}
</Text>


<Text style={styles.value}>
{value}
</Text>


</View>

);


}








const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:'#FFFDF8',
},



imageContainer:{
height:230,
},



petImage:{
width:'100%',
height:'100%',
},



back:{
position:'absolute',
top:25,
left:15,
},



backText:{
fontSize:35,
color:'white',
},



more:{
position:'absolute',
top:25,
right:15,
},



moreText:{
fontSize:30,
color:'white',
},





card:{
backgroundColor:'#FFFDF8',
borderTopLeftRadius:30,
borderTopRightRadius:30,
marginTop:-20,
padding:15,
flex:1,
},



titleRow:{
flexDirection:'row',
alignItems:'center',
},



petName:{
fontSize:22,
fontWeight:'700',
color:'#16444A',
marginRight:5,
},



row:{
flexDirection:'row',
marginTop:10,
},



label:{
width:90,
fontSize:12,
color:'#777',
},



value:{
fontSize:12,
fontWeight:'600',
color:'#333',
},



link:{
fontSize:12,
color:'#1976D2',
},

});