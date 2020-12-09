
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Button, Alert, Dimensions, Modal, TouchableHighlight } from 'react-native';
import { Container, Content, List, ListItem, Left, Thumbnail, Body, View, Header, Icon, Title, Right} from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { registerRootComponent } from 'expo';
import * as SQLite from 'expo-sqlite';

const Stack = createStackNavigator();

const db = SQLite.openDatabase('db.NotesTest')

export default function NotesStack(){

  return(
    <NavigationContainer>
    <Stack.Navigator> 
      <Stack.Screen name="Notes App"    
                    component={MainScreen}
                    options={{ 
                      headerTitle: 'Notes App', 
                      headerTitleStyle: styles.header,
                      headerStyle: {
                        height: Math.round(Dimensions.get('window').height)/8,
                      } }}/>
      <Stack.Screen name="Notes" 
                    component={DetailsScreen} 
                    options={{title: "", headerRight: () => (
                    <Button 
                      onPress={() => console.log("This works!")}        
                      title="Edit   " 
                      color="#000"/>)}}/> 
    </Stack.Navigator>
    </NavigationContainer>
  );
}

function MainScreen( { navigation } ) {

  const [data, setData] = useState([])
  const [modalVisible, setModalVisibility] = useState(false)

  function writeTable() {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO Notes (title, content) values (?, ?)', ['Notes from Econ Lecture', 'Who am I kidding I didnt show up.'],
        (txObj, resultSet) => {
          console.log("helo")
          console.log(resultSet)
          setData(data => [ 
            { id: resultSet.insertId, title: 'Notes 1', content: 'lorem ipsum' } ])
          console.log(data)},
        (txObj, error) => console.log('Error 3', error)
      )
    })
  }

  
  useEffect(() => {
    console.log('componentDidLoad 21st time')
    //Create table
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS Notes (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, content TEXT)', null, 
      (txObj, resultSet) => console.log('Table successfully created / has been created.'), (txObj, error) => console.log("Error 1", error))
    })
    //Read Table
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM  Notes', null,
        (txObj, notes ) => {
          console.log('Table has been read')
          setData(notes.rows._array)
          console.log(data)
        }, 
        (txObj, error) => console.log('Error 2', error)
        )
    })

    //Dummmy Data 

    // db.transaction(tx => {
    //   tx.executeSql('INSERT INTO  Notes (title, content) VALUES (?, ?)', ["Notes from Econ Lecture", "Who am I kidding I did not show up"],
    //   (txObj, resultSet) => {
    //     setData(data.push({ id: resultSet.insertId, title: 'Notes from Econ Lecture', content: 'Who am I kidding I did not show up' }) )
    //     console.log("Data:", data)},
    //   (txObj, error) => console.log('Error 3', error))
    // })
  }, []) //componentDidLoad()

  
  return (
    <Container>
      <Content>
        <List>
          {
            data.map((item) => (
              <ListItem avatar key={item.id} onPress={() => navigation.navigate("Notes", {title: item.title, content: item.content}) }>
                <Body>
                  <Text style ={styles.titleText}>{item.title}</Text>
                  <Text note numberOfLines={1} style={styles.contentText}>
                    {item.content}
                  </Text>
                </Body>
              </ListItem>
            ))
          }
        </List>
        <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed."); }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Hello World!</Text>
              <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setModalVisible(!modalVisible); }}>
                <Text style={styles.textStyle}>Hide Modal</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </Content>
    </Container>
  );
}


function DetailsScreen( { route } ) {
  const { title, content } = route.params
  return (
    <View>
      <Text style={styles.titleDetailsText}> { title } </Text>
      <Text style={styles.detailText}> {content} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 20,
    fontWeight: '500',
    color: 'black',
  },
  contentText: {
    fontSize: 15, 
    fontWeight: '300', 
    color: '#aaa'
  },
  titleDetailsText: {
    marginTop: 10, 
    marginLeft: 15, 
    fontSize: 30,
    fontWeight: 'bold',
  },
  detailText: {
    marginTop: 20, 
    marginLeft: 25, 
    fontSize: 20,
    fontWeight: '300',
  },
})

registerRootComponent(NotesStack)