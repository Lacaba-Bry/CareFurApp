import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default function EditProfileScreen({navigation}:any){

return(
<SafeAreaView style={styles.container}>

<ScrollView showsVerticalScrollIndicator={false}>

<Text style={styles.header}>
Edit Profile
</Text>

<TouchableOpacity onPress={()=>navigation.goBack()}>
<Text style={styles.back}>‹</Text>
</TouchableOpacity>


<View style={styles.photo}>
<Image
source={require('../assets/Login/Logo.jpg')}
style={styles.avatar}
/>
<Text style={styles.change}>
Change Picture
</Text>
</View>



<View style={styles.form}>

<Field label="First Name:" value="Beia"/>
<Field label="Last Name:" value="Ann"/>
<Field label="Birthday:" value="MM/DD/YY"/>
<Field label="Age:" value="23"/>


<View style={styles.line}>

<Text style={styles.label}>
Sex:
</Text>

<View style={styles.dropdown}>
<Text>⌄</Text>
</View>

</View>


</View>



<View style={styles.buttons}>

<TouchableOpacity style={styles.cancel}>
<Text style={styles.btn}>
CANCEL
</Text>
</TouchableOpacity>


<TouchableOpacity style={styles.apply}>
<Text style={styles.btn}>
APPLY
</Text>
</TouchableOpacity>

</View>



<Image
source={require('../assets/Login/LogoSignup.png')}
style={styles.dog}
/>


</ScrollView>

</SafeAreaView>
);

}





function Field({
label,
value
}:{
label:string;
value:string;
}){

return(

<View style={styles.line}>

<Text style={styles.label}>
{label}
</Text>


<TextInput
value={value}
style={styles.input}
/>


</View>

);

}







const styles = StyleSheet.create({

container:{
flex:1,
backgroundColor:'#FFFDF8',
},


header:{
fontSize:12,
color:'#ccc',
marginLeft:5,
marginTop:5,
},


back:{
fontSize:35,
marginLeft:10,
marginTop:-5,
},


photo:{
alignItems:'center',
marginTop:0,
},


avatar:{
width:70,
height:70,
borderRadius:50,
},


change:{
fontSize:10,
},


form:{
backgroundColor:'#D8C48E',
borderRadius:18,
padding:12,
margin:10,
},


line:{
flexDirection:'row',
alignItems:'center',
marginBottom:10,
},


label:{
width:'25%',
fontSize:11,
},


input:{
flex:1,
height:27,
backgroundColor:'white',
borderRadius:12,
borderWidth:1,
paddingHorizontal:10,
fontSize:12,
},


dropdown:{
flex:1,
height:27,
backgroundColor:'white',
borderRadius:12,
alignItems:'flex-end',
justifyContent:'center',
paddingRight:10,
},


buttons:{
flexDirection:'row',
justifyContent:'flex-end',
marginRight:10,
gap:8,
},


cancel:{
backgroundColor:'#aaa',
paddingHorizontal:15,
paddingVertical:7,
borderRadius:20,
},


apply:{
backgroundColor:'#0B6E71',
paddingHorizontal:15,
paddingVertical:7,
borderRadius:20,
},


btn:{
color:'white',
fontSize:11,
fontWeight:'bold',
},


dog:{
width:'100%',
height:200,
resizeMode:'contain',
marginTop:5,
},


});