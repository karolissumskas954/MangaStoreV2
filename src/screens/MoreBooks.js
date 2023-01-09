import { StyleSheet, Text, View, SafeAreaView,TouchableOpacity, Image, ScrollView, FlatList} from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/core';
import { db } from '../../firebase';
import { COLORS, FONTS, SIZES, icons} from '../../constants';
import { useFonts } from 'expo-font';

export default function MoreBooks() {

  const [loaded] = useFonts({
    Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
    Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });

    const [blogs, setBlogs] = useState([])
    const navigation = useNavigation()

    const fetchBlogs = async () => {
      db.ref('manga/').once('value', function (snapshot) {
        const items = []
        snapshot.forEach((doc) => {
          const { title, uri, author, description, language, pages, postEmail, price, publisher, isbn } = doc.val()
          items.push({
            id: doc.id,
            title,
            uri,
            author,
            description,
            language,
            pages,
            price,
            postEmail,
            publisher,
            isbn
          })
        })
        setBlogs(items)
      })
    }
    useEffect(() => {
      fetchBlogs();
    }, [])
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, marginTop: -35}}>
         <View style={{ flexDirection: 'row', paddingHorizontal: 12, height: 80, alignItems: 'flex-end' }}>
          <TouchableOpacity
            style={{ marginLeft: 18}}
            onPress={()=> navigation.replace("Home")}
          >
            <Image
              source={icons.back_icon}
              resizeMode="contain"
              style={{ width: 25, height: 25, tintColor: COLORS.white }}
            />
          </TouchableOpacity>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white, marginLeft: 75 }}>More Books</Text>
        </View>
    <ScrollView style={{ margintop: 12 }}>
    <View style={{ flex: 1, marginTop: 12, paddingLeft: 24 }}>
        <FlatList
          data={blogs}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
            <TouchableOpacity
            testID='bookButton'
              style={{ flex: 1, flexDirection: 'row' }}
              onPress={() => navigation.navigate("Book", item)}
            >
              {/* Book cover  */}
              <Image
                source={{ uri: item.uri }}
                resizeMode='cover'
                style={{ width: 100, height: 150, borderRadius: 10 }}
              />
              <View style={{ flex: 1, marginLeft: 12, marginTop: -5}}>
                {/* Book name and author  */}
                <View>
                  <Text style={{ paddingRight: SIZES.padding, fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>{item.title}</Text>
                  <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.lightGray }}>{item.author}</Text>
                </View>
                {/* Book Info  */}
                <View style={{ flexDirection: 'row', marginTop: 7}}>
                  <Image
                    source={icons.page_icon}
                    resizeMode="contain"
                    style={{ width: 20, height: 20, tintColor: "#64676D" }}
                  />
                  <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.lightGray, paddingHorizontal: SIZES.radius }}>
                    {item.pages}
                  </Text>
                </View>
                {/* Data  */}
                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                  <View style={{ justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: 5, backgroundColor: COLORS.darkGreen, height: 40, borderRadius: SIZES.radius }}>
                    <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 12, color: COLORS.lightGreen }}>
                    €{item.price}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: 5, backgroundColor: COLORS.darkRed, height: 40, borderRadius: SIZES.radius }}>
                    <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 12, color: COLORS.lightRed }}>
                      {item.language}
                    </Text>
                  </View>
                  <View style={{ justifyContent: 'center', alignItems: 'center', padding: SIZES.base, marginRight: 5, backgroundColor: COLORS.darkBlue, height: 40, borderRadius: SIZES.radius }}>
                    <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 12, color: COLORS.lightBlue }}>
                      {item.publisher}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          )}
        />
      </View>
    </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({})