import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { useNavigation } from '@react-navigation/core'
import { LogBox } from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage"]); // Ignore log notification by message
LogBox.ignoreLogs(['fontFamily "Roboto-Regular" is not a system font and has not been loaded through Font.loadAsync.']);
LogBox.ignoreLogs(['fontFamily "Roboto-Bold" is not a system font and has not been loaded through Font.loadAsync.'])
import { useFonts } from 'expo-font';
import Modal from 'react-native-modal';
import uuid from 'react-native-uuid';
import { Font } from 'expo';

const LoginScreen = () => {

    const [loaded] = useFonts({
        Roboto_Regular: require('../../assets/fonts/Roboto-Regular.ttf'),
        Roboto_Bold: require('../../assets/fonts/Roboto-Bold.ttf'),
    });

    const [loginModal, setLoginModal] = useState(false)
    const [registerModal, setRegisterModal] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const navigation = useNavigation();
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                navigation.replace("Home")
            }
        })
        return unsubscribe
    }, [])

    const addUserDetails = () => {
        const id = uuid.v4();
        db
            .ref('users/' + id)
            .set({
                email: email,
                fullName: name,
                phone: phone
            })
            .then(() => {
                setEmail('')
                setName('')
                setPassword('')
                setPhone('')
            })
            .catch((error) => {
                console.error("Error adding document: ", error);
            });
    }

    const handleSignUp = () => {
        auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredentials => {
                //const user = userCredentials.user;
                addUserDetails();
                alert("Account sucessfully created")
            })
            .catch((error) => alert(error.message));
    }
    const handleLogIn = () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredentials => {
                const user = userCredentials.user;
            })
            .catch((error) => alert(error.message));
    }

    function renderLoginModal() {
        return (
            <Modal
                animationType='slide'
                visible={loginModal}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        height: '55%',
                        borderTopStartRadius: 20,
                        borderTopEndRadius: 20
                    }}>
                    <View style={{ flex: 0.2, marginTop: 15, }}>
                        <TouchableOpacity
                            style={{ marginLeft: 18 }}
                            onPress={() => {
                                setLoginModal(false)
                                setEmail('')
                                setPassword('')
                            }}>
                            <Image
                                source={icons.back_icon}
                                resizeMode="contain"
                                style={{ width: 25, height: 25, tintColor: COLORS.black }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 25, color: COLORS.black, alignSelf: 'center', marginTop: -33 }}>Sign In</Text>
                    </View>
                    <View
                        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor={COLORS.darkGreen}
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            placeholderTextColor={COLORS.darkGreen}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={handleLogIn}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={{ width: '55%' }}>
                            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 15, color: COLORS.black, marginLeft: '51%' }}>I'm a new user.</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setLoginModal(false)
                                    setEmail('')
                                    setPassword('')
                                    setRegisterModal(true)
                                }}
                            >
                                <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 15, color: COLORS.primary }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    function renderRegisterModal() {
        return (
            <Modal
                animationType='slide'
                visible={registerModal}
                style={{ justifyContent: 'flex-end', margin: 0 }}>
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        height: '65%',
                        borderTopStartRadius: 20,
                        borderTopEndRadius: 20
                    }}>
                    <View style={{ flex: 0.2, marginTop: 15, }}>
                        <TouchableOpacity
                            style={{ marginLeft: 18 }}
                            onPress={() => {
                                setRegisterModal(false)
                                setEmail('')
                                setPassword('')
                                setName('')
                                setPhone('')
                            }}>
                            <Image
                                source={icons.back_icon}
                                resizeMode="contain"
                                style={{ width: 25, height: 25, tintColor: COLORS.black }}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 25, color: COLORS.black, alignSelf: 'center', marginTop: -33 }}>Create Acount</Text>
                    </View>
                    <View
                        style={{ flex: 1.9, justifyContent: 'center', alignItems: 'center' }}>
                        <TextInput
                            style={styles.input}
                            placeholder='Full Name'
                            placeholderTextColor={COLORS.darkGreen}
                            value={name}
                            onChangeText={text => setName(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Phone Number'
                            placeholderTextColor={COLORS.darkGreen}
                            value={phone}
                            onChangeText={text => setPhone(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Email'
                            placeholderTextColor={COLORS.darkGreen}
                            value={email}
                            onChangeText={text => setEmail(text)}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder='Password'
                            placeholderTextColor={COLORS.darkGreen}
                            value={password}
                            onChangeText={text => setPassword(text)}
                            secureTextEntry
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={handleSignUp}
                            style={styles.button}
                        >
                            <Text style={styles.buttonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap' }}>
                        <View style={{ width: '60%' }}>
                            <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 15, color: COLORS.black, marginLeft: '34%' }}>I'm already a member.</Text>
                        </View>
                        <View>
                            <TouchableOpacity
                                onPress={() => {
                                    setLoginModal(true)
                                    setEmail('')
                                    setPassword('')
                                    setName('')
                                    setPhone('')
                                    setRegisterModal(false)
                                }}
                            >
                                <Text style={{ fontFamily: 'Roboto_Regular', fontSize: 15, color: COLORS.primary }}>Sign In</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }


    return (
        <View style={{ flex: 1, flexDirection: 'column' }}>
            <View style={{ flex: 1, backgroundColor: COLORS.white, justifyContent: 'center', alignItems: 'center', marginBottom: -30 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Image
                        source={{ uri: 'https://i.pinimg.com/564x/26/19/f9/2619f9244680707e4ffbbd49f3417ead.jpg' }}
                        resizeMode="cover"
                        style={{ width: 320, height: 450, borderRadius: 20, marginTop: -380 }}
                    />

                    <Text style={{ fontFamily: 'Roboto_Bold', fontSize: 40, justifyContent: 'center', alignItems: 'center', color: COLORS.tone, marginTop: -420 }}>My Manga.</Text>
                </View>
            </View>
            <View style={{ flex: 0.3, backgroundColor: COLORS.white, alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity
                    onPress={() => { setLoginModal(true) }}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => { setRegisterModal(true) }}
                    style={[styles.button, styles.buttonOutline]}
                >
                    <Text style={styles.buttonOutlineText}>Register</Text>
                </TouchableOpacity>
            </View>

            {loginModal && renderLoginModal()}
            {registerModal && renderRegisterModal()}
        </View>
    )
}
export default LoginScreen
const styles = StyleSheet.create({
    back: {
        backgroundColor: COLORS.background
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.grey
    },
    inputContainer: {
        width: '80%'
    },
    input: {
        backgroundColor: COLORS.lightGray2,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        width: '80%',
    },
    buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,

    },
    button: {
        backgroundColor: COLORS.primary,
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 16,
    },
    buttonOutline: {
        backgroundColor: COLORS.white,
        marginTop: 5,
        borderColor: COLORS.tone,
        borderWidth: 2,
        marginTop: 15

    },
    buttonOutlineText: {
        color: COLORS.tone,
        fontWeight: '700',
        fontSize: 16,
    },
    titleText: {
        color: '#E0DACC',
        fontSize: '20px',
        fontFamily: 'KohinoorBangla-Semibold'
    },
    titleText2: {
        color: '#E0DACC',
        fontSize: '45px',
        fontFamily: 'KohinoorBangla-Semibold',
        marginTop: -10

    },
    titleContainer: {
        marginBottom: 40,
        justifyContent: 'left',
        alignItems: 'left',
    },
    image: {
        width: '100%',
        height: '15%',
        marginTop: -240,
        marginBottom: 100,
        borderRadius: 10
    }
})