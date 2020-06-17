import React from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
import Calendar from './../Schedules/Calendar/Calendar';
import './MyDocument.css';

// Font.register({
//   family: 'Source Sans Pro',
//   src: "https://fonts.googleapis.com/css2?family=Source+Sans+Pro&display=swap"
// });


// Create styles
const styles = StyleSheet.create({
  header: {
    fontSize: 12,
    marginBottom: 10,
    marginTop: 5,
    textAlign: 'center',
    color: 'grey',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 10,
  },
  weekday: {
    marginTop: 10,
    marginBottom: 3,
    fontSize: 14,
    alignSelf: 'center'
  },
  table: { 
    display: "table", 
    width: "auto", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderRightWidth: 0, 
    borderBottomWidth: 0
  }, 
  tableBody:{
       paddingRight: 10,
       paddingLeft: 10 
  },
  tableRow: { 
    margin: "auto", 
    flexDirection: "row" 
  }, 
  tableCol: { 
    width: "25%", 
    borderStyle: "solid", 
    borderWidth: 1, 
    borderLeftWidth: 0, 
    borderTopWidth: 0 
  }, 
  tableCell: { 
    margin: "auto", 
    marginTop: 5, 
    fontSize: 10,
    height: 75,
    paddingLeft: 3
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
            <Text style={styles.weekday}>
            Sunday                  Monday                 Tuesday              Wednesday              Thursday                 Friday                 Saturday
            </Text>
            <View style={styles.tableBody}> 
              <View style={styles.table}> 
                <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View>
                <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text> 
                  </View>
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View>
                 <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text> 
                  </View>
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View>
                 <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text> 
                  </View>
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View>
                 <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text> 
                  </View>
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View> 
                 <View style={styles.tableRow}> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                  <View style={styles.tableCol}>
                    <Text style={styles.tableCell}></Text> 
                  </View>
                  <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View> 
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                   <View style={styles.tableCol}> 
                    <Text style={styles.tableCell}></Text> 
                  </View>
                </View> 
              </View>
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