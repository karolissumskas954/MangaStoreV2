import { Button, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { BarCodeScanner } from 'expo-barcode-scanner'
import { useNavigation } from '@react-navigation/core'
import { COLORS, FONTS, SIZES, icons} from '../../constants';
import { useFonts } from 'expo-font';


export default function Scanner() {

    const [loaded] = useFonts({
        Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
        Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
      });

    const navigation = useNavigation();
    function renderNavBar() {
        return (
            <View style={{ paddingHorizontal: 20, height: 80, paddingVertical: 60 }}>
                <TouchableOpacity
                    style={{ marginLeft: 14 }}
                    onPress={() => navigation.replace("Home")}
                >
                    <Image
                        source={icons.back_icon}
                        resizeMode="contain"
                        style={{ width: 25, height: 25, tintColor: '#E0DACC' }}
                    />
                </TouchableOpacity>
            </View>
        )
    }
    
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [showButton, setShowButton] = useState(false);
    const [text, setText] = useState('Not yet scanned')

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState()
    const [author, setAuthor] = useState('')
    const [publisher, setPublisher] = useState("")
    const [language, setLanguage] = useState("")
    const [pages, setPages] = useState('')
    const [isbn, setIsbn] = useState('')
    const [description, setDescription] = useState("")
    const [uri, setUri] = useState("")
    const [blogs, setBlogs] = useState([])

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        let lines = data.split('^');
        setTitle(lines[0])
        setPrice(lines[1])
        setAuthor(lines[2])
        setPublisher(lines[3])
        setLanguage(lines[4])
        setPages(lines[5])
        setIsbn(lines[6])
        setDescription(lines[7])
        setUri(lines[8])
        setBlogs({
            title: title,
            price: parseFloat(price, 10),
            author: author,
            publisher: publisher,
            language: language,
            pages: pages,
            isbn: isbn,
            description: description,
            uri: uri
        })
        console.log(blogs.title)

        if (typeof blogs.title == 'undefined' || blogs.title == ''){
            setText("Please rescan")
        } else {
            setText(blogs.title)
            setShowButton(true)
        }

    };
    if (hasPermission === null) {
        return <Text>Requesting for Camera Permission</Text>
    }
    if (hasPermission === false) {
        return <Text>No Access to Camera</Text>
    }
    return (
        <>
            <View style={{ backgroundColor: COLORS.background }}>
                {renderNavBar()}
            </View>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>

                <View style={{ alignItems: 'center', justifyContent: 'center', height: 300, width: 300, overflow: 'hidden', borderRadius: 30, backgroundColor: 'tomato', marginTop: -100 }}>
                    <BarCodeScanner
                        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                        style={{ width: 400, height: 400 }} />
                </View>
                {scanned &&
                    <TouchableOpacity
                        onPress={() => {
                            setScanned(false)
                            setText('Not yet scanned')

                        }}
                    >
                        <Text style={{ marginTop: 15, color: COLORS.primary, fontSize: 22, marginBottom:15 }}>Tap to Scan Again</Text>
                    </TouchableOpacity>}
                <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 22, color: COLORS.white }}>Book title: </Text>
                    <Text style={{ marginTop: 5, fontFamily: 'Roboto_Regular', fontSize: 16, color: COLORS.white }}>{text}</Text>
                </View>
                <View style={{ flex: 0.2, alignItems: 'center', justifyContent: 'center', marginTop: 15 }}>
                    {showButton &&
                        <TouchableOpacity
                            style={{ backgroundColor: COLORS.primary, borderRadius: 12, alignItems: 'center', justifyContent: 'center', width: 200, height: 50 }}
                            onPress={() => navigation.navigate("ScannedBook", blogs)}
                        >
                            <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 16, color: COLORS.white }}>Book details</Text>
                        </TouchableOpacity>}
                </View>
            </View>
        </>

    )

}