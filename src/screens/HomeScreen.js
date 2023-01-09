import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  FlatList,
  Item,
  ScrollView,
  SafeAreaView,
  StatusBar
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/core';
import { db } from '../../firebase';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]); // Ignore log notification by message
LogBox.ignoreLogs(["VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead."]); // Ignore log notification by message
LogBox.ignoreLogs(['fontFamily "Roboto-Regular" is not a system font and has not been loaded through Font.loadAsync.']);
LogBox.ignoreLogs(['fontFamily "Roboto-Bold" is not a system font and has not been loaded through Font.loadAsync.'])
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';

const HomeScreen = () => {
  const [deleteModal, setDeleteModal] = useState(false)
  const [selItem, setSetItem] = useState('')
  const [totPri, setTotPri] = useState(0)
  const [loaded] = useFonts({
    Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
    Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });

  const categoriesData = [
    {
      id: 0,
      categoryName: "Best Seller",
    },
    {
      id: 1,
      categoryName: "The Latest"
    },
    {
      id: 2,
      categoryName: "Coming Soon"
    },
  ];
  const [blogs, setBlogs] = useState([])

  const fetchBlogs = async () => {
    var query = db.ref("manga").orderByKey();
    query.once("value")
      .then(function (snapshot) {
        const items = []
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          const { title, uri, author, description, language, pages, postEmail, price, publisher, isbn } = childSnapshot.val()
          items.push({
            id: key,
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
        });
        setBlogs(items)
      })
  }
  const email = auth.currentUser?.email;
  const [cart, setCart] = useState([])

  const fetchCart = async () => {
    var totalPrice = 0;
    let lines = email.split('@');
    var query = db.ref("cart/" + lines[0]).orderByKey();
    query.once("value")
      .then(function (snapshot) {
        const items = []
        snapshot.forEach(function (childSnapshot) {
          var key = childSnapshot.key;
          const { title, uri, author, description, language, pages, price, publisher, isbn } = childSnapshot.val()
          totalPrice = totalPrice + price
          items.push({
            id: key,
            title,
            uri,
            author,
            description,
            language,
            pages,
            price,
            publisher,
            isbn
          })
        });
        setCart(items)
        setTotPri(totalPrice);
      })
  }
  useEffect(() => {
    fetchCart();
    fetchBlogs();
  }, [])

  const deleteItemFromCart = () => {
    let lines = email.split('@');
    db.ref("cart/" + lines[0] + "/" + selItem).remove()
      .then(() => {
        alert("Item Removed")
        setSetItem("")
        navigation.replace("Home")
      })
      .catch(() => alert("No"))
  }

  const navigation = useNavigation()
  const [categories, setCategory] = React.useState(categoriesData);
  const [selectedCategory, setSelectedCategory] = React.useState(0);

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch((error) => alert(error.message));
  }

  function renderDeleteModal() {
    return (
      <Modal
        animationType='slide'
        visible={deleteModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            height: '20%',
            borderTopStartRadius: 20,
            borderTopEndRadius: 20
          }}>
          <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 18, color: COLORS.black }}>Remove this item from cart?</Text>
          </View>
          <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <View style={{ width: '50%', alignItems: 'center' }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: '80%', padding: 10, borderRadius: 10, alignItems: 'center' }}
                  onPress={() => { deleteItemFromCart() }}
                >
                  <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 18, color: COLORS.white }}>Remove</Text>
                </TouchableOpacity>
              </View>
              <View style={{ width: '50%', alignItems: 'center' }}>
                <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: '80%', padding: 10, borderRadius: 10, alignItems: 'center' }}
                  onPress={() => { setDeleteModal(false) }}
                >
                  <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 18, color: COLORS.white }}>Exit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
  function renderHeader(profile) {
    return (
      <View style={{
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: SIZES.padding,
        alignItems: 'center'
      }}>
        {/* Greetings */}
        <View style={{ flex: 1 }}>
          <View style={{ marginRight: SIZES.padding }}>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>Good Morning</Text>
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.tone }}>{profile}</Text>
          </View>
        </View>
        {/* Log out */}
        <TouchableOpacity
          style={{
            backgroundColor: COLORS.primary,
            height: 40,
            paddingLeft: 3,
            paddingRight: SIZES.radius,
            borderRadius: 20
          }}
          onPress={handleSignOut}
        >
          <View
            style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
          >
            <View style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: 25, backgroundColor: COLORS.tone }}>
              <Image
                source={icons.logout_icon}
                resizeMode="contain"
                style={{ width: 20, height: 20, marginLeft: 5, tintColor: COLORS.white }}
              />
            </View>
            <Text style={{ marginLeft: SIZES.base, color: COLORS.white, fontFamily: 'Roboto_Regular', fontSize: 16, }}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
  const LineDivider = () => {
    return (
      <View style={{ width: 1, paddingVertical: 18, }}>
        <View style={{ flex: 1, borderLeftColor: COLORS.tone, borderLeftWidth: 1 }}>
        </View>
      </View>
    )
  }

  function renderButtonSection() {
    return (
      <View
        style={{ flex: 1, justifyContent: 'center', padding: SIZES.padding }}
      >
        <StatusBar barStyle="light-content" />
        <View style={{ flexDirection: 'row', height: 70, backgroundColor: COLORS.primary, borderRadius: SIZES.radius }}>
          {/* Add book */}
          <TouchableOpacity
            testID='addButton'
            style={{ flex: 1 }}
            onPress={() => navigation.replace("AtCounter")}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={icons.add_icon}
                resizeMode="contain"
                style={{ width: 25, height: 25, tintColor: COLORS.white }}
              />
              <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>  Check Out</Text>
                <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>  €{totPri}</Text>
              </View>
            </View>
          </TouchableOpacity>
          {/* Line Divider */}
          <LineDivider />
          {/* all books */}
          <TouchableOpacity
            testID='allBooksButton'
            style={{ flex: 1 }}
            onPress={() => navigation.replace("More")}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={icons.book_icon}
                resizeMode="contain"
                style={{ width: 25, height: 25, tintColor: COLORS.white }}
              />
              <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}>  All Books</Text>
            </View>
          </TouchableOpacity>
          {/* Line Divider */}
          <LineDivider />
          {/* Scanner */}
          <TouchableOpacity
            testID='scanButton'
            style={{ flex: 1 }}
            onPress={() => navigation.navigate("Scan")}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                source={icons.scan_icon}
                resizeMode="contain"
                style={{ width: 30, height: 30, tintColor: COLORS.white }}
              />
              <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 14, color: COLORS.white }}> Scan book</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  function renderMyBookSection() {
    return (
      <View style={{ flex: 1 }}>
        {/* Header */}
        <View style={{ paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>Cart</Text>
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.primary }}>Total: {totPri}€</Text>
        </View>
        {/* Books */}
        <View style={{ flex: 1, marginTop: 18 }}>
          <FlatList
            data={cart}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item, index }) => {
              return (
                <TouchableOpacity
                  testID='editButton'
                  style={{ flex: 1, marginLeft: index == 0 ? 24 : 0, marginRight: 22 }}
                  onPress={() => {
                    setDeleteModal(true)
                    setSetItem(item.id)
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    resizeMode="cover"
                    style={{ width: 180, height: 250, borderRadius: 20 }} />
                  {deleteModal && renderDeleteModal()}
                </TouchableOpacity>
              )
            }}
          />
        </View>
      </View>
    )
  }

  function renderCategoryHeader() {
    return (
      <View style={{ flex: 1, paddingLeft: 24 }}>
        <ScrollView horizontal={true} style={{ width: "100%" }}>
          <FlatList
            data={categoriesData}
            showsHorizontalScrollIndicator={false}
            horizontal
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={{ flex: 1, marginRight: 24 }}
                onPress={() => setSelectedCategory(item.id)}
              >
                {
                  selectedCategory == item.id &&
                  <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>{item.categoryName}</Text>
                }
                {
                  selectedCategory != item.id &&
                  <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.lightGray }}>{item.categoryName}</Text>
                }
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    )
  }

  function renderCategoryData() {
    var start = 0
    var end = 4
    if (selectedCategory == 0) {
      start = 0
      end = 4
    } else if (selectedCategory == 1) {
      start = 4
      end = 8

    } else if (selectedCategory == 2) {
      start = 8
      end = 12
    }
    return (
      <View style={{ flex: 1, marginTop: 12, paddingLeft: 24 }}>
        <FlatList
          data={blogs.slice(start, end)}
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
                <View style={{ flex: 1, marginLeft: 12, marginTop: -5 }}>
                  {/* Book name and author  */}
                  <View>
                    <Text style={{ paddingRight: SIZES.padding, fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>{item.title}</Text>
                    <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.lightGray }}>{item.author}</Text>
                  </View>
                  {/* Book Info  */}
                  <View style={{ flexDirection: 'row', marginTop: 7 }}>
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
    )
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={{ height: 200 }}>
        {renderHeader(email)}
        {renderButtonSection()}
      </View>
      {/* Body section */}
      <ScrollView style={{ margintop: 12 }}>
        {/* My Books section */}
        <View>
          {renderMyBookSection()}
        </View>
        {/* Category section */}
        <View style={{ marginTop: 24 }}>
          <View>
            {renderCategoryHeader()}
          </View>
          <View>
            {renderCategoryData()}
          </View>
          <View style={{ padding: 8, marginLeft: 12 }}>
            <TouchableOpacity
              testID='moreButton'
              onPress={() => navigation.replace("More")}
            >
              <Text style={{ ...FONTS.body3, color: COLORS.lightGray, alignSelf: 'flex-start', textDecorationLine: 'underline' }}> More Books</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
})