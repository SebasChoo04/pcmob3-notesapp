import * as React from 'react';
import { StyleSheet, Text, useState, Button } from 'react-native';
import { Container, Content, List, ListItem, Left, Thumbnail, Body, View, Header, Icon, Title, Right} from 'native-base';



  const styles = StyleSheet.create({
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
      detailText: {
        marginTop: 20, 
        marginLeft: 20, 
        fontSize: 20,
      },
  })

  export default MainScreen