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



export default function CameraScreen(){

  return (

    <SafeAreaView style={styles.container}>


      {/* Header */}

      <View style={styles.header}>

        <Text style={styles.back}>
          ‹
        </Text>


        <View>

          <Text style={styles.title}>
            Live Camera
          </Text>


          <View style={styles.infoRow}>

            <Text style={styles.info}>
              🐾 Pet: Sachi
            </Text>


            <Text style={styles.info}>
              🏠 Room: A-10
            </Text>

          </View>


        </View>


      </View>





      {/* Camera View */}

      <Image

        source={require('../assets/Login/LogoSignup.png')}

        style={styles.camera}

        resizeMode="cover"

      />



      <TouchableOpacity style={styles.fullscreen}>

        <Text style={styles.fullText}>
          ⛶ Full screen
        </Text>

      </TouchableOpacity>







      {/* Captured */}

      <View style={styles.line}/>


      <Text style={styles.captureTitle}>
        Captured Snapshots:
      </Text>


      <Text style={styles.count}>
        5/15
      </Text>






      {/* Snapshot */}

      <View style={styles.snapshotRow}>


        <Text style={styles.arrow}>
          ◀
        </Text>



        <Image

          source={require('../assets/Login/Logo.jpg')}

          style={styles.snapshot}

        />



        <Text style={styles.arrow}>
          ▶
        </Text>


      </View>





      <TouchableOpacity style={styles.photos}>

        <Text style={styles.photosText}>
          View All Photos →
        </Text>


      </TouchableOpacity>






      {/* Date */}

      <View style={styles.details}>


        <Text>
          📅 Date: 99/99/99
        </Text>


        <Text>
          🕘 Time: 03:00 PM
        </Text>


      </View>







      {/* Controls */}

      <View style={styles.controls}>


        <Ionicons
          name="volume-high"
          size={25}
          color="white"
        />


        <View style={styles.circle}/>


        <Ionicons
          name="videocam"
          size={28}
          color="white"
        />


      </View>





    </SafeAreaView>

  );

}






const styles = StyleSheet.create({


container:{
  flex:1,
  backgroundColor:'#FFFDF8',
  paddingHorizontal:25,
},



header:{
  flexDirection:'row',
  alignItems:'center',
  marginTop:25,
},



back:{
  fontSize:40,
  marginRight:35,
},



title:{
  fontSize:20,
  fontStyle:'italic',
  fontWeight:'700',
},



infoRow:{
  flexDirection:'row',
},



info:{
  fontSize:11,
  marginRight:15,
},




camera:{
  width:'100%',
  height:130,
  marginTop:15,
},




fullscreen:{
  alignSelf:'center',
  backgroundColor:'#999',
  paddingHorizontal:12,
  borderRadius:10,
},



fullText:{
  color:'white',
  fontSize:11,
},




line:{
  borderBottomWidth:1,
  borderColor:'#ddd',
  marginTop:8,
},



captureTitle:{
  textAlign:'center',
  fontWeight:'bold',
  marginTop:5,
},



count:{
  textAlign:'center',
  fontWeight:'bold',
},





snapshotRow:{
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-between',
  marginTop:10,
},



snapshot:{
  width:165,
  height:95,
  borderRadius:15,
},



arrow:{
  color:'#D06435',
  fontSize:25,
},





photos:{
  alignSelf:'center',
  backgroundColor:'#E5F5F4',
  paddingHorizontal:20,
  paddingVertical:5,
  borderRadius:15,
},



photosText:{
  fontSize:11,
},




details:{
  flexDirection:'row',
  justifyContent:'space-between',
  marginTop:12,
},




controls:{
  height:45,
  backgroundColor:'#275861',
  borderRadius:12,
  marginTop:10,
  flexDirection:'row',
  justifyContent:'space-around',
  alignItems:'center',
},



circle:{
  width:30,
  height:30,
  borderRadius:20,
  backgroundColor:'white',
  borderWidth:3,
  borderColor:'#9DBAC0',
},


});