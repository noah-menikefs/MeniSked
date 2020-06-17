import React from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
import Calendar from './../Schedules/Calendar/Calendar';

// Font.register({
//   family: 'Source Sans Pro',
//   src: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
// });


// Create styles
const styles = StyleSheet.create({
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  weekdays: {
    marginTop: '10in',
    textAlign: 'center',
    alignContent: 'space-between',
    flexWrap: 'wrap'

  },
  weekday: {
    fontSize: 14
  }
});
// Create Document Component
class MyDocument extends React.Component{ 
  constructor(props){
    super(props);
    this.state = {
      test: 'working'
    }
  }


  render(){
    const {user, type, dateContext} = this.props;
     return (
      <Document>
          <Page orientation="landscape" size="A4" style={styles.page}>
            <Text style={styles.header}>  
              {user.department+', '+user.firstname+' '+user.lastname+"'s "+type+' Schedule'}
            </Text>
            <Text style={styles.title}>
              {dateContext.format('MMMM Y')}
            </Text>
            <View style={styles.weekdays}>
              <Text style={styles.weekday}>Sunday</Text>
              <Text style={styles.weekday}>Monday</Text>
              <Text style={styles.weekday}>Tuesday</Text>
              <Text style={styles.weekday}>Wednesday</Text>
              <Text style={styles.weekday}>Thursday</Text>
              <Text style={styles.weekday}>Friday</Text>
              <Text style={styles.weekday}>Saturday</Text>
            </View>
            {/*<Canvas width="100px" height="100px" style={styles.canvas}>
               <Calendar entries={entries} callList={callList} personalDays={personalDays} holiDays={holiDays} type="Personal" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
            </Canvas>*/}
          </Page>
      </Document>
    );
  }

 
}

export default MyDocument;