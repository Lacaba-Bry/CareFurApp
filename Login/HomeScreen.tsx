import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';



export default function HomeScreen() {

  return (

    <SafeAreaView style={styles.container}>


      <View style={styles.content}>


        {/* HEADER */}

        <View style={styles.header}>

          <Text style={styles.hello}>
            Hello
          </Text>


          <Text style={styles.name}>
            Beia Ann!
          </Text>


          <Text style={styles.subtitle}>
            Check on your pet and see how they're doing
          </Text>


        </View>





        {/* BUTTON GRID */}

        <View style={styles.grid}>


          <DashboardCard
            title="Sachi's Profile"
            icon="paw"
            color="#D06435"
          />


          <DashboardCard
            title="Slot Availability"
            icon="calendar"
            color="#14646B"
          />


          <DashboardCard
            title="Message Stay"
            icon="chatbox"
            color="#16444A"
          />


          <DashboardCard
            title="Boarding Details"
            icon="bed"
            color="#B4A276"
          />


        </View>






        {/* UPDATE HEADER */}

        <View style={styles.sectionTitle}>


          <Text style={styles.smallTitle}>
            Latest Update
          </Text>


          <Text style={styles.smallTitle}>
            Meals Today
          </Text>


        </View>







        {/* UPDATE */}

        <View style={styles.updateRow}>


          <View style={styles.updateBox}>


            <Text style={styles.time}>
              3:00 PM
            </Text>


            <Text style={styles.food}>
              Sachi was fed Lunch.
            </Text>


            <Text style={styles.view}>
              View Photo →
            </Text>


          </View>





          <View style={styles.circle}>


            <Text style={styles.percent}>
              67%
            </Text>


            <Text style={styles.done}>
              DONE
            </Text>


          </View>


        </View>







        {/* FOOD */}

        <Text style={styles.section}>
          Food Details:
        </Text>





        <View style={styles.bottomCards}>


          <View style={styles.foodCard}>


            <Text>
              🍚 Wet Food
            </Text>


            <Text>
              • 2 scoops
            </Text>


            <Text>
              🍗 Dry Food
            </Text>


            <Text>
              • 2 scoops
            </Text>


          </View>





          <View style={styles.feedCard}>


            <Text>
              Dinner
            </Text>


            <Text style={styles.timeBig}>
              08:00
            </Text>


            <Text>
              PM
            </Text>


          </View>


        </View>



      </View>


    </SafeAreaView>

  );

}







function DashboardCard({

  title,
  icon,
  color,

}:{

  title:string;
  icon:any;
  color:string;

}) {


  return (

    <TouchableOpacity

      style={[
        styles.card,
        {
          backgroundColor:color
        }
      ]}

    >


      <Ionicons

        name={icon}

        size={25}

        color="white"

      />



      <Text style={styles.cardText}>
        {title}
      </Text>



    </TouchableOpacity>

  );

}








const styles = StyleSheet.create({


  container:{

    flex:1,

    backgroundColor:'#FFFDF8',

  },



  content:{

    flex:1,

    paddingHorizontal:10,

  },



  header:{

    marginTop:35,

    marginLeft:18,

  },



  hello:{

    fontSize:38,

    fontStyle:'italic',

    fontWeight:'700',

  },



  name:{

    fontSize:40,

    fontStyle:'italic',

    fontWeight:'700',

  },



  subtitle:{

    fontSize:12,

    color:'#555',

  },





  grid:{

    flexDirection:'row',

    flexWrap:'wrap',

    justifyContent:'center',

    marginTop:18,

  },





  card:{

    width:'45%',

    height:65,

    borderRadius:12,

    justifyContent:'center',

    alignItems:'center',

    margin:4,

  },





  cardText:{

    color:'white',

    fontSize:11,

    marginTop:5,

  },





  sectionTitle:{

    flexDirection:'row',

    justifyContent:'space-between',

    marginHorizontal:20,

    marginTop:12,

  },





  smallTitle:{

    fontSize:11,

    fontWeight:'bold',

  },





  updateRow:{

    flexDirection:'row',

    justifyContent:'space-around',

    alignItems:'center',

    marginTop:8,

  },





  updateBox:{

    backgroundColor:'#E7F5F4',

    padding:12,

    borderRadius:12,

    width:200,

  },





  time:{

    fontSize:22,

    fontWeight:'bold',

  },





  food:{

    fontSize:12,

  },





  view:{

    fontSize:10,

    color:'#0B6E71',

    marginTop:5,

  },





  circle:{

    width:75,

    height:75,

    borderRadius:40,

    borderWidth:10,

    borderColor:'#D06435',

    justifyContent:'center',

    alignItems:'center',

  },





  percent:{

    fontSize:18,

    fontWeight:'bold',

  },





  done:{

    fontSize:8,

  },





  section:{

    fontWeight:'bold',

    marginTop:10,

    marginLeft:18,

  },





  bottomCards:{

    flexDirection:'row',

    justifyContent:'space-around',

    marginTop:5,

  },





  foodCard:{

    backgroundColor:'#C9B47C',

    width:'45%',

    padding:10,

    borderRadius:12,

  },





  feedCard:{

    backgroundColor:'#A8B4E8',

    width:'45%',

    padding:10,

    borderRadius:12,

    alignItems:'center',

  },





  timeBig:{

    fontSize:25,

    fontWeight:'bold',

  },


});