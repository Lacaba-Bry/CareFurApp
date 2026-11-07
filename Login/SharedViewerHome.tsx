import React from 'react';
import {SafeAreaView,ScrollView,Text,View,TouchableOpacity} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {colors} from '../lib/theme';
export default function SharedViewerHome({navigation,route}:any){
 const params=route?.params??{};
 const go=(screen:string)=>navigation.getParent()?.navigate(screen,params);
 return <SafeAreaView style={{flex:1,backgroundColor:colors.background}}><ScrollView contentContainerStyle={{padding:22}}>
 <Text style={{fontSize:28,fontWeight:'800',color:colors.primaryDark}}>Shared boarding view</Text>
 <Text style={{color:colors.textSecondary,marginVertical:10}}>You have read-only access to this pet's authorized stay. Editing, room reservations and messaging aren't available to shared viewers.</Text>
 {[["paw-outline","Pet Profile","PetProfile"],["bed-outline","Boarding Details","BoardingDetails"]].map(([icon,title,target])=><TouchableOpacity key={title} onPress={()=>go(target)} style={{backgroundColor:'#fff',borderRadius:17,borderWidth:1,borderColor:colors.border,marginTop:12,padding:20,flexDirection:'row',alignItems:'center'}}><Ionicons name={icon as any} size={24} color={colors.primary}/><Text style={{marginLeft:15,fontWeight:'800',fontSize:17,color:colors.primaryDark}}>{title}</Text><Ionicons name="chevron-forward" size={22} color={colors.textMuted} style={{marginLeft:'auto'}}/></TouchableOpacity>)}
 <View style={{backgroundColor:'#edf1f0',padding:18,borderRadius:18,marginTop:25,alignItems:'center'}}><Ionicons name="shield-checkmark-outline" size={26} color={colors.primary}/><Text style={{marginTop:8,color:colors.primaryDark,fontWeight:'700'}}>Read-only shared access</Text></View>
 </ScrollView></SafeAreaView>;
}
