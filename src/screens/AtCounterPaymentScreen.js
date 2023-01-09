import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { db, auth } from '../../firebase';
import { COLORS, SIZES, icons } from '../../constants';
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';
import QRCode from 'react-native-qrcode-svg';

const AtCounterPaymentScreen = ({ navigation }) => {
  const [loaded] = useFonts({
    Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
    Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
  });
  const email = auth.currentUser?.email;
  const [cart, setCart] = useState([])
  const [totPri, setTotPri] = useState(0)
  const [counterModal, setCounterModal] = useState(false)

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
  }, [])

  const LineDivider = () => {
    return (
      <View
        style={{
          height: 1,
          width: '85%',
          borderColor: COLORS.white,
          borderBottomWidth: 2,
          padding: 5,
          alignSelf: 'center'
        }}/>
    )}

  function renderHeader() {
    return (
      <View style={{ flexDirection: 'row', paddingHorizontal: 12, height: 80, alignItems: 'flex-end' }}>
        <TouchableOpacity
          style={{ marginLeft: 18 }}
          onPress={() => navigation.replace("Home")}
        >
          <Image
            source={icons.back_icon}
            resizeMode="contain"
            style={{ width: 25, height: 25, tintColor: COLORS.white }}
          />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white, marginLeft: '32%' }}>Cart</Text>
      </View>
    )
  }

  function renderCartItems() {
    return (
      <View style={{ flex: 1, marginTop: 12, paddingLeft: 24 }}>
        <FlatList
          data={cart}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ marginVertical: 8 }}>
              <TouchableOpacity
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
                    <View style={{ justifyContent: 'center', alignItems: 'bottom', padding: SIZES.base, marginRight: 5, backgroundColor: COLORS.darkGreen, height: 40, borderRadius: SIZES.radius }}>
                      <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 18, color: COLORS.lightGreen }}>
                        €{item.price}
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
              <LineDivider />
            </View>
          )} />
      </View>
    )
  }

  function renderCounterModal() {
    let lines = email.split('@');
    return (
      <Modal
        animationType='slide'
        visible={counterModal}
        style={{ justifyContent: 'flex-end', margin: 0 }}>
        <View
          style={{
            backgroundColor: COLORS.white,
            height: '95%',
            borderTopStartRadius: 20,
            borderTopEndRadius: 20
          }}>
          <View style={{ flex: 0.1, paddingHorizontal: 12, height: 80, marginTop: 20 }}>
            <TouchableOpacity
              style={{ marginLeft: 18 }}
              onPress={() => { setCounterModal(false) }}
            >
              <Image
                source={icons.back_icon}
                resizeMode="contain"
                style={{ width: 25, height: 25, tintColor: COLORS.black }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <QRCode value={lines[0]} size={250} />
          </View>
        </View>
      </Modal>
    )}

  function renderPaymentMethodButton() {
    return (
      <View style={{ flex: 0.4, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: '80%', padding: 10, borderRadius: 10, alignItems: 'center' }}
              onPress={() => { setCounterModal(true) }}
            >
              <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 18, color: COLORS.white }}>Pay At Counter</Text>

            </TouchableOpacity>
          </View>
          <View style={{ width: '50%', alignItems: 'center' }}>
            <TouchableOpacity style={{ backgroundColor: COLORS.primary, width: '80%', padding: 10, borderRadius: 10, alignItems: 'center' }}
              onPress={() => { 
                navigation.replace("Holder")
               }}
            >
              <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 18, color: COLORS.white }}>Pay With Card</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, marginTop: -35 }}>
      <ScrollView style={{ margintop: 12 }}>
        {renderHeader()}
        {renderCartItems()}
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>Total price:
            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.lightGreen }}> {totPri}€ </Text>
          </Text>
        </View>
        <View style={{ marginTop: 20, marginBottom: 20 }}>
          {renderPaymentMethodButton()}
        </View>
        {counterModal && renderCounterModal()}
      </ScrollView>
    </SafeAreaView>
  )
}

export default AtCounterPaymentScreen

const styles = StyleSheet.create({})