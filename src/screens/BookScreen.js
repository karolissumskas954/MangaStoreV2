import { ImageBackground, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, Animated } from 'react-native'
import React, { useState, useEffect } from 'react'
import { COLORS, FONTS, SIZES, icons} from '../../constants';
import { useFonts } from 'expo-font';
import { db } from '../../firebase';
import { auth } from '../../firebase';
import uuid from 'react-native-uuid';

const BookScreen = ({ route, navigation }) => {

  const [loaded] = useFonts({
    Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
    Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });

  const {
    title,
    uri,
    author,
    description,
    language,
    pages,
    publisher,
    isbn,
    price} = route.params

  const email = auth.currentUser?.email;

  const writeData = () => {
    let lines = email.split('@');
    //alert(lines[0])
    const id = uuid.v4()
    db
    .ref('cart/' + lines[0] + '/' + id)
    .set({
      title: title,
      price: price,
      author: author,
      publisher: publisher,
      language: language,
      pages: pages,
      isbn: isbn,
      description: description,
      uri: uri
    })
    .then(() => {
      console.log("Document written with ID: ", id);
      alert("Book Added to Cart")
      navigation.replace("Home")
    })
    .catch((error) => {
      console.error("Error adding document: ", error);
    });
  }
  const LineDivider = () => {
    return (
      <View style={{ width: 1, paddingVertical: 5, }}>
        <View style={{ flex: 1, borderLeftColor: COLORS.white, borderLeftWidth: 1 }}>
        </View>
      </View>
    )
  }
  const [scrollViewWholeHeight, setscrollViewWholeHeight ] = React.useState(1);
  const [scrollViewVisibleHeight, setscrollViewVisibleHeight ] = React.useState(0);
  const indicator = new Animated.Value(0);

  function renderBookInfoSection() {
    return (
      <View style={{ flex: 1 }}>
        <ImageBackground
          source={{ uri: uri }}
          resizeMode='cover'
          style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
        />
        {/* Color overlay */}
        <View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, backgroundColor: COLORS.background, opacity: 0.8 }}>
        </View>
        <View style={{ flexDirection: 'row', paddingHorizontal: 12, height: 80, alignItems: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 8 }}
            onPress={() => navigation.goBack()}
          >
            <Image
              source={icons.back_icon}
              resizeMode="contain"
              style={{ width: 25, height: 25, tintColor: COLORS.white }}
            />
          </TouchableOpacity>
        </View>
        {/* Book cover  */}
        <View style={{ flex: 5, paddingTop: 36, alignItems: 'center' }}>
          <Image
            source={{ uri: uri }}
            resizeMode='contain'
            style={{ flex: 1, width: 150, height: 'auto' }}
          />
        </View>
        {/* Book name and author*/}
        <View style={{ flex: 1.8, alignItems: 'center', justifyContent: 'center', marginTop: 5 }}>
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}> {title}</Text>
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.white }}>{author}</Text>
        </View>
        {/* Book info  */}
        <View style={{ flexDirection: 'row', paddingVertical: 20, margin: 24, borderRadius: 12, backgroundColor: "rgba(0,0,0,0.6)" }}>
          {/* Price  */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.white }}>Price</Text>
            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>€{price}</Text>
          </View>
          <LineDivider />
          {/* Pages  */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.white }}>Pages</Text>
            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>{pages}</Text>
          </View>
          <LineDivider />
          {/* Language */}
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.white }}>Language</Text>
            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>{language}</Text>
          </View>
        </View>
      </View>
    )
  }

  function renderBookDescription() {
    const indicatorSize = scrollViewWholeHeight > scrollViewVisibleHeight ?
    scrollViewVisibleHeight * scrollViewVisibleHeight / scrollViewWholeHeight :
    scrollViewVisibleHeight

    const difference = scrollViewVisibleHeight > indicatorSize ? 
    scrollViewVisibleHeight - indicatorSize : 1

    return (
      <View style={{flex: 1, flexDirection: 'row', padding: 24}}>
        {/* Custom scrollbar  */}
        <View style={{width: 4, height: '100%', backgroundColor: "#282C35"}}>

        <Animated.View
          style={{width: 4, height: indicatorSize, backgroundColor: '#7D7E84', 
          transform : [{
            translateY: Animated.multiply(indicator, scrollViewVisibleHeight/ scrollViewWholeHeight).
            interpolate({
              inputRange: [0, difference],
              outputRange: [0, difference],
              extrapolate: 'clamp'
            })
          }]
          }}
        />
        </View>
        {/* Description */}
        <ScrollView
          contentContainerStyle={{ paddingLeft: 36}}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onContentSizeChange ={(width, height) => {
            setscrollViewWholeHeight(height)
          }}
          onLayout={({nativeEvent: {layout: {x,y, width, height}}}) => {
            setscrollViewVisibleHeight(height)
          }}
          onScroll={Animated.event(
            [{nativeEvent: {contentOffset: {y: indicator} } }],
            {useNativeDriver: false}
          )}
        >
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white, marginBottom: 10 }}>Description</Text>
          <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 20, color: "#64676D" }}>{description}</Text>
        </ScrollView>
      </View>
    )
  }

  function renderBottomButton() {
    const [color, setColor] = useState("#25282F")
    return( 
      <View style={{flex:1, flexDirection:'row', marginTop: -5, marginBottom: 5}}>
        {/* BookMark */}
        <TouchableOpacity
        style={{width: 60, backgroundColor: color, marginLeft: 24, marginVertical: 8, borderRadius: 12,alignContent: 'center', alignItems: 'center', justifyContent: 'center' }}
        onPress={() => {
          
          if(color == "#25282F"){
            setColor(COLORS.primary)
          } else if (color == COLORS.primary){
            setColor("#25282F")
          }
          }}
        >
          <Image
          source={icons.bookmark_icon}
          resizeMode='contain'
          style={{ width: 25, height: 25, tintColor: COLORS.white}}
          />
        </TouchableOpacity>
        {/* Buy book  */}
        <TouchableOpacity
        style={{flex:1, backgroundColor: COLORS.primary, marginHorizontal: 8, marginVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}
        onPress={()=> writeData()}
        >
          <Text style={{fontFamily: 'Roboto_Bold', fontSize: 20, color: COLORS.white }}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    )
  }
  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Book Cover */}
      <View style={{ flex: 4 }}>
        {renderBookInfoSection()}
      </View>

      {/* Describtion */}
      <View style={{ flex: 2 }}>
        {renderBookDescription()}
      </View>

      <View style={{ height: 70 }}>
        {renderBottomButton()}
      </View>
    </View>
  )
}
export default BookScreen
const styles = StyleSheet.create({})