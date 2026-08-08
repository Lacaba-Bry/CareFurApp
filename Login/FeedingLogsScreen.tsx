import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';



export default function FeedingLogsScreen() {


  return (

    <SafeAreaView style={styles.container}>


      {/* HEADER */}

      <View style={styles.header}>


        <Text style={styles.back}>
          ‹
        </Text>


        <Text style={styles.title}>
          Feeding Logs
        </Text>


        <Ionicons
          name="options-outline"
          size={22}
        />


      </View>






      {/* PET CARD */}

      <View style={styles.petCard}>


        <Image

          source={require('../assets/Login/Logo.jpg')}

          style={styles.petImage}

        />


        <View>

          <Text style={styles.petName}>
            Sachi
          </Text>


          <Text style={styles.info}>
            🐾 Dog　🏠 Shih-Poo　♀ Female
          </Text>


        </View>


        <Text style={styles.arrow}>
          ⌄
        </Text>


      </View>






      {/* MEALS */}

      <View style={styles.meals}>


        <Text>
          🍽 Meals Today
        </Text>


        <Text>
          ✓ Breakfast　✓ Lunch　◌ Dinner
        </Text>


      </View>







      <Text style={styles.date}>
        Today, July 19, 2026
      </Text>





      {/* FILTER */}

      <View style={styles.filter}>


        <Text>
          All
        </Text>


        <Text>
          Completed
        </Text>


        <Text>
          Scheduled
        </Text>


      </View>







      {/* DINNER */}

      <FoodLog

        color="#C9B47C"

        time="8:00 PM — Dinner"

        status="⌛"

      />






      {/* LUNCH */}

      <FoodLog

        color="#F49B7D"

        time="3:00 PM — Lunch"

        status="✓"

      />








      {/* BREAKFAST */}

      <FoodLog

        color="#55B8C5"

        time="9:00 AM — Breakfast"

        status="✓"

      />





    </SafeAreaView>

  );

}







function FoodLog({

  color,

  time,

  status,

}:{

  color:string;

  time:string;

  status:string;

}){


return (

<View style={[styles.log,{backgroundColor:color}]}>


<View style={styles.logHeader}>


<Text style={styles.time}>
{time}
</Text>


<Text>
{status}
</Text>


</View>





<Text style={styles.item}>
○ Dry Food:　2 scoops (Holistic Adult)
</Text>


<Text style={styles.item}>
○ Wet Food:　Aozi Chicken (150 g)
</Text>


<Text style={styles.item}>
○ Water:　Refilled
</Text>


<Text style={styles.item}>
○ Fed By:　Staff - Bryan
</Text>




<TouchableOpacity style={styles.photoBtn}>

<Text style={styles.photoText}>
View Feeding Photo →
</Text>

</TouchableOpacity>



</View>

);


}







const styles = StyleSheet.create({


container:{
flex:1,
backgroundColor:'#FFFDF8',
paddingHorizontal:15,
},



header:{
flexDirection:'row',
justifyContent:'space-between',
alignItems:'center',
marginTop:20,
},



back:{
fontSize:35,
},



title:{
fontSize:20,
fontStyle:'italic',
fontWeight:'700',
},



petCard:{
flexDirection:'row',
alignItems:'center',
borderWidth:1,
borderColor:'#ddd',
borderRadius:15,
padding:8,
marginTop:10,
},



petImage:{
width:40,
height:40,
borderRadius:20,
marginRight:10,
},



petName:{
fontWeight:'bold',
},



info:{
fontSize:10,
},



arrow:{
  marginLeft:'auto',
},


meals:{
marginTop:8,
},



date:{
fontWeight:'bold',
marginTop:10,
},



filter:{
flexDirection:'row',
justifyContent:'space-around',
backgroundColor:'#eee',
padding:5,
borderRadius:10,
},



log:{
borderRadius:15,
padding:10,
marginTop:8,
},



logHeader:{
flexDirection:'row',
justifyContent:'space-between',
},



time:{
fontWeight:'bold',
},



item:{
fontSize:12,
marginTop:5,
},



photoBtn:{
alignSelf:'flex-end',
backgroundColor:'#16444A',
borderRadius:10,
paddingHorizontal:8,
paddingVertical:3,
marginTop:5,
},



photoText:{
fontSize:9,
color:'white',
},


});