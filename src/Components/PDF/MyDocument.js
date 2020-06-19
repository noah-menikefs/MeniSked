import React from 'react';
import { Page, Text, Document, StyleSheet, View } from '@react-pdf/renderer';
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
    marginBottom: 5,
  },
  weekday: {
    marginTop: 5,
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
    height: 84,
    borderTopWidth: 0 
  }, 
  tableCell: { 
    marginTop: 1,  
    fontSize: 10,
    paddingLeft: 3
  } 

});
// Create Document Component
class MyDocument extends React.Component{ 
  constructor(props){
    super(props);
    this.state = {
    }
  }

  render(){
    const {user, type, dateContext, holiDays, personalDays, entries, callList, callSked} = this.props;
    let firstDay = dateContext.startOf('month').format('d'); //Day of week 0-6
    let daysInMonth = dateContext.daysInMonth();
    let ctr = 1;
    let day = '';
    let tableRows = [];
    let holiday = '';
    let today = [];
    let name = '';

    let listType = [];

    if (callSked){
      listType = [...callSked];
    }
    else {
      listType = [...personalDays];
    }

    for (let i = 0; i < 6; i++){
      let tableCols = [];
      for (let j = 0; j < 7; j++){
        today = []
        day = ''
        holiday = ''
        if ((i !== 0 || j >= firstDay) && (ctr <= daysInMonth)){
          day = ctr;
          for (let n = 0; n < holiDays.length; n++){
            if (holiDays[n].day === ctr){
              holiday = holiDays[n].name;
            }
          }
          for (let m = 0; m < listType.length; m++){
            console.log(listType[m]);
            name = '';
            if (listType[m].date === dateContext.format('MM')+'/'+ctr+'/'+dateContext.format('YYYY')){
              for (let x = 0; x < entries.length; x++){
                if (entries[x].id === listType[m].id){
                  name = entries[x].name;
                  break;
                }
              }
              for (let t = 0; t < callList.length; t++){
                if (callList[t].id === listType[m].id){
                  name = callList[t].name;
                  if (listType[m].name){
                    name = name + ' ' + listType[m].name;
                  }
                  break;
                }
              }

              today.push(<Text key={m} style={styles.tableCell}>{name}</Text>);
            }
          }

          ctr++;
        }
        tableCols.push(
          <View key={j} style={styles.tableCol}> 
            <Text style={styles.tableCell}>{day+'   '+holiday}</Text>
            {today}
          </View> 
        )
      }
      tableRows.push(tableCols);
    }

    let dept = user.department.replace(' Admin', '');
    if (dept === 'ST-JOES-A'){
      dept = "Dept. of Anesthesia, St. Joseph's Health Centre";
    }


    return (
      <Document>
          <Page orientation="landscape" size="A4" style={styles.page}>
            <Text style={styles.header}>  
              {dept +', '+type+' Schedule'}
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
                  {tableRows[0]}
                </View>
                <View style={styles.tableRow}> 
                  {tableRows[1]}
                </View>
                <View style={styles.tableRow}> 
                  {tableRows[2]}
                </View>
                <View style={styles.tableRow}> 
                  {tableRows[3]}
                </View>
                <View style={styles.tableRow}> 
                  {tableRows[4]}
                </View> 
                <View style={styles.tableRow}> 
                  {tableRows[5]}
                </View> 
              </View>
            </View>
          </Page>
      </Document>
    );
  }

 
}

export default MyDocument;