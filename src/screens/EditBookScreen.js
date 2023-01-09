import { Button, TextInput, StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, KeyboardAvoidingView, ScrollView, } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/core'
import { db } from '../../firebase';
import { auth } from '../../firebase';
import uuid from 'react-native-uuid';
import { COLORS, FONTS, SIZES, icons} from '../../constants';

export default function ({ route, navigation }) {
  const { 
    id,
    title,
    uri,
    author,
    description,
    language,
    pages,
    price,
    postEmail,
    isbn,
    publisher } = route.params
  const email = auth.currentUser?.email;
  const [id1, setTid] = useState(id)
  const [title1, setTitle] = useState(title)
  const [price1, setPrice] = useState(price)
  const [author1, setAuthor] = useState(author)
  const [publisher1, setPublisher] = useState(publisher)
  const [language1, setLanguage] = useState(language)
  const [pages1, setPages] = useState(pages)
  const [isbn1, setIsbn] = useState(isbn)
  const [description1, setDescription] = useState(description)
  const [uri1, setUri] = useState(uri)

  const writeData = (id) => {
    db.ref("manga/" + id).remove()
    .then(() => {
      const uid = uuid.v4()
    db
    .ref('manga/' + uid)
    .set({
      title: title1,
      price: price1,
      author: author1,
      publisher: publisher1,
      language: language1,
      pages: pages1,
      isbn: isbn1,
      description: description1,
      postEmail: email,
      uri: uri1
    })
    .then(() => {
      console.log("Document Edited with ID: ", uid);
      alert("Book Edited")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    })})
    .catch(() => alert("No"))
  }

  const deleteItem = (id) => {
    db.ref("manga/" + id).remove()
    .then(() => {
      alert("Item Deleted")
      navigation.replace("Home")

    })
    .catch(() => alert("No"))
  }

  function renderNavBar() {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, height: 80, alignItems: 'flex-end' }}>
        <TouchableOpacity
          style={{ marginLeft: 18 }}
          onPress={() => navigation.replace("Home")}
        >
          <Image
            source={icons.back_icon}
            resizeMode="contain"
            style={{ width: 25, height: 25, tintColor: '#E0DACC' }}
          />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'KohinoorBangla-Semibold', fontSize: 22, color: '#E0DACC', marginLeft: 50 , width: 250}}>{title1}</Text>
      </View>
    )
  }

  function renderTopBlock() {
    return (
      <View style={{ flexDirection: 'row', padding: 24, alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ marginRight: 10 }}>
          {/* Title  */}
          <TextInput
            style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, width: 200 }}
            placeholder='Enter Title here'
            placeholderTextColor={'#808080'}
            value={title1}
            onChangeText={text =>setTitle(text)}
          />
          {/* Author */}
          <TextInput
            style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
            placeholder='Enter Author here'
            placeholderTextColor={'#808080'}
            value={author1}
            onChangeText={text =>setAuthor(text)}
          />
          {/* Language  */}
          <TextInput
            style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
            placeholder='Enter Language here'
            placeholderTextColor={'#808080'}
            value={language1}
            onChangeText={text => setLanguage(text)}
          />
          {/* Price  */}
          <TextInput
            style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5 }}
            placeholder='Enter Price here'
            placeholderTextColor={'#808080'}
            value={price1}
            onChangeText={text => setPrice(text)}
          />
          {/* Pages  */}
          <TextInput
            style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
            placeholder='Enter Pages here'
            placeholderTextColor={'#808080'}
            value={pages1}
            onChangeText={text => setPages(text)}
          />
        </View>
        <TouchableOpacity style={{}}>
          <Image
            source={{ uri: uri1 == '' ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2D4asDbDXWzTnoqacip37NbQgwMAJQ2YkrmkKayU2IRWyEgba2EpenRXPsB6TV-8fI4M&usqp=CAU' : uri1 }}
            resizeMode='contain'
            style={{ flex: 1, width: 150, height: 230 }}
          />
        </TouchableOpacity>
      </View>
    )
  }

  function renderBottomBlock() {
    return (
      <View style={{ padding: 24, marginTop: -35 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
        </View>
        {/* isbn */}
        <TextInput
          style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
          placeholder='Enter ISBN here'
          placeholderTextColor={'#808080'}
          value={isbn1}
          onChangeText={text => setIsbn(text)}
        />
        {/* Publisher  */}
        <TextInput
          style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
          placeholder='Enter Publisher here'
          placeholderTextColor={'#808080'}
          value={publisher1}
          onChangeText={text =>setPublisher(text)}
        />
        {/* URI  */}
        <TextInput
          style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5, }}
          placeholder='Enter URI here'
          placeholderTextColor={'#808080'}
          value={uri1}
          onChangeText={text => setUri(text)}
        />
        {/* Description */}
        <TextInput
          style={{ backgroundColor: '#E0DACC', paddingHorizontal: 15, paddingVertical: 10, borderRadius: 10, marginTop: 5 }}
          placeholder='Enter Description here'
          placeholderTextColor={'#808080'}
          value={description1}
          onChangeText={text => setDescription(text)}
        />
        {/* Buttons  */}
        <TouchableOpacity
          style={{ backgroundColor: "#F96D41", padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20 }}
          onPress={() => writeData(id)}
        >
          <Text style={{ fontFamily: 'KohinoorBangla-Semibold', fontSize: 16, color: '#E0DACC' }}>Edit Book</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ backgroundColor: '#E0DACC', padding: 14, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 20, borderColor: "#F96D41", borderWidth: 1 }}
          onPress={() => deleteItem(id)}
        >
          <Text style={{ fontFamily: 'KohinoorBangla-Semibold', fontSize: 16, color: "#F96D41" }}>Delete Book</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1E1B26', marginTop: 0 }}>
      {/* NavBar  */}
      <View style={{ flex: 1 }}>
        {renderNavBar()}
        {/* InputFiels  */}
        {renderTopBlock()}
        {renderBottomBlock()}
      </View>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({})
