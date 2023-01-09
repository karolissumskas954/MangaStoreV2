import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { 
  LoginScreen,
  HomeScreen,
  AddBookScreen,
  BookScreen,
  MoreBooks,
  EditBook,
  Scanner,
  ScannedBookScreen,
  AtCounterPaymentScreen
} from './src/screens';

const Stack = createStackNavigator();
const theme = {
  ...DefaultTheme,
  colors: {
      ...DefaultTheme.colors,
      border: "transparent"
  }
}

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator
      screenOptions={{
        headerShown: false
      }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Add" component={AddBookScreen} />
        <Stack.Screen name="Book" component={BookScreen} />
        <Stack.Screen name="More" component={MoreBooks} />
        <Stack.Screen name="Edit" component={EditBook} />
        <Stack.Screen name="Scan" component={Scanner} />
        <Stack.Screen name="ScannedBook" component={ScannedBookScreen} />
        <Stack.Screen name="AtCounter" component={AtCounterPaymentScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}