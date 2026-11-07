import React from 'react';
import {SafeAreaView,View,Text,TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../lib/theme';
export default function LockedBoardingFeature({navigation,feature}:any){
 const camera=String(feature).toLowerCase().includes('camera');
 const openCode=()=>{const parent=navigation.getParent();if(parent)parent.navigate('Code');else navigation.navigate('Code');};
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}>
  <View style={{padding:22,flex:1}}>
   <Text style={{fontSize:27,fontWeight:'800',color:colors.primaryDark,marginTop:12}}>{feature}</Text>
   <Text style={{color:colors.textSecondary,marginTop:8}}>Available during an authorized CareFur boarding stay.</Text>
   <View style={{flex:1,marginTop:22,borderRadius:25,borderWidth:1,borderColor:'#becdca',backgroundColor:'#617475',alignItems:'center',justifyContent:'center',padding:24}}>
    <View style={{backgroundColor:'#fff',borderRadius:50,width:86,height:86,alignItems:'center',justifyContent:'center'}}><Ionicons name="lock-closed" size={36} color={colors.primaryDark}/></View>
    <Text style={{fontSize:22,color:'#fff',fontWeight:'800',marginTop:20,textAlign:'center'}}>{feature} is locked</Text>
    <Text style={{fontSize:14,color:'#eff8f5',textAlign:'center',marginTop:12,lineHeight:22}}>Enter the boarding code assigned to your signed-in account to access {camera?'your pet’s live camera':'feeding activity'}.</Text>
    <TouchableOpacity accessibilityRole="button" onPress={openCode} style={{backgroundColor:colors.primary,paddingHorizontal:23,paddingVertical:15,borderRadius:30,marginTop:23,flexDirection:'row',alignItems:'center'}}><Ionicons name="key-outline" size={18} color="#fff"/><Text style={{color:'#fff',fontWeight:'800',marginLeft:8}}>Enter Boarding Code</Text></TouchableOpacity>
   </View>
  </View>
 </SafeAreaView>;
}
