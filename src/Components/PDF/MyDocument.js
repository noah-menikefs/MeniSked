import React from 'react';
import { Page, Text, Document, StyleSheet, Font, Canvas } from '@react-pdf/renderer';
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
    const {user, type, dateContext, entries, callList, personalDays, holiDays, today, onDayClick, style} = this.props;
     return (
      <Document>
          <Page orientation="landscape" size="A4" style={styles.page}>
            <Text style={styles.header}>  
              {user.department+', '+user.firstname+' '+user.lastname+"'s "+type+' Schedule'}
            </Text>
            <Text style={styles.title}>
              {dateContext.format('MMMM Y')}
            </Text>
            {/*<Canvas width="100px" height="100px" style={styles.canvas}>
               <Calendar entries={entries} callList={callList} personalDays={personalDays} holiDays={holiDays} type="Personal" dateContext={dateContext} today={today} style={style} onDayClick={(e,day) => this.onDayClick(e,day)}/>
            </Canvas>*/}
          </Page>
      </Document>
    );
  }

 
}

export default MyDocument;