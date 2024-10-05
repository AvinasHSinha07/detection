import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Pressable, Modal, ActivityIndicator } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Checkbox } from 'react-native-paper';


export default function LoginScreen({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isRememberMeChecked, setIsRememberMeChecked] = useState(false);
    const [loggedInStatus, setLoggedInStatus] = useState(false);
    const [welcomeUserName, setWelcomeUserName] = useState('');


    const signIn = async () => {
        try {
            setLoading(true);
            setEmail(email.trim());

            await signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                intermediateSignUp(user)
            })
            .catch((e) => {
                if (e.code === 'auth/invalid-credential') setErrorMessage("Wrong Password");
                if (e.code === 'auth/user-not-found') setErrorMessage('No account matches this email');
                else console.log(e);
                // console.log(e.code)
                setLoading(false);
            })
            setLoading(false);
            
        } catch (e) {
            if (e.code === 'auth/invalid-credential') setErrorMessage("Wrong Password");
            if (e.code === 'auth/user-not-found') setErrorMessage('No account matches this email');
            else console.log(e);
            // console.log(e.code)
            setLoading(false);
        }
    };


    const intermediateSignUp = async (user)=>{
        if (user.emailVerified) {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                const { userName, user_id, email, dp_url } = userData;
                const loggedUserInfo = {
                    userRef: user_id,
                    userEmail: email,
                    userName: userName,
                    userProfilePic: dp_url
                };
                setWelcomeUserName(userName);
                if (isRememberMeChecked == true) {
                    const loggedUserInfoString = JSON.stringify(loggedUserInfo);
                    AsyncStorage.setItem('userData', loggedUserInfoString)
                        .then(() => {
                            console.log('Data stored successfully!');
                        })
                        .catch((error) => {
                            console.log('Error storing data:', error);
                        });
                }
                
                setEmail('');
                setPassword('');
                setLoading(false);
                setLoggedInStatus(true);
            });
        } else {
            alert("Please verify your email first.");
        }
    }



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TextInput
                style={styles.input} placeholder='E-mail' placeholderTextColor="#aaaaaa"
                onChangeText={(text) => { setEmail(text); setErrorMessage(''); }} value={email}
                underlineColorAndroid="transparent" autoCapitalize="none"
            />
            <TextInput
                style={styles.input} placeholderTextColor="#aaaaaa" secureTextEntry={!showPassword} placeholder='Password'
                onChangeText={(text) => { setPassword(text); setErrorMessage('') }} value={password}
                underlineColorAndroid="transparent" autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={24} color="#aaaaaa" />
                </TouchableOpacity>

            {/* <Pressable style={styles.checkboxContainer} onPress={() => setIsRememberMeChecked(!isRememberMeChecked)}>
                <Checkbox
                    style={styles.checkbox}
                    status={isRememberMeChecked ? 'checked' : 'unchecked'}
                    value={isRememberMeChecked}
                    onValueChange={() => setIsRememberMeChecked(!isRememberMeChecked)}
                    color={isRememberMeChecked ? '#e80909' : undefined}
                />
                <Text style={styles.checkboxLabel}>Keep me logged in</Text>
            </Pressable> */}

            {errorMessage.length > 0 && <Text style={{ color: 'red', textAlign: 'center' }}>*{errorMessage}*</Text>}
            <TouchableOpacity
                disabled={password.length == 0 || email.length == 0}
                style={styles.button}
                onPress={signIn}>
                <Text style={styles.buttonTitle}>
                    {loading ? <ActivityIndicator size={18} color={"#fff"} /> : "Log in"}
                </Text>
            </TouchableOpacity>
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Don't have an account? <Text onPress={() => {
                    setEmail('');
                    setPassword('');
                    setErrorMessage('')
                    navigation.navigate('SignUp')
                }} style={styles.footerLink}>Sign up</Text></Text>
            </View>

            <Modal
                visible={loggedInStatus}
                animationType="fade"
                transparent={true}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        {/* <Ionicons name="md-person" size={64} color="#e80505" /> */}
                        <Text style={styles.welcomeText}>
                            Welcome, <Text style={styles.usernameText}>{welcomeUserName}</Text>
                        </Text>
                        <TouchableOpacity style={styles.cancelButton}
                            onPress={() => {
                                setLoggedInStatus(false);
                                // navigation.popToTop();
                                navigation.replace('Home');
                            }}
                        >
                            <Text style={styles.cancelButtonText}>Enter</Text>
                        </TouchableOpacity>
                    </View>

                </View>

            </Modal>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
  container: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 20,
      backgroundColor: '#5356FF'
  },
  logo: {
      width: 150,
      height: 150,
      marginBottom: 20,
  },
  input: {
    //   height: 40,
      width: '80%',
      borderColor: 'white',
      borderWidth: 1,
      marginBottom: 20,
      paddingHorizontal: 10,
      backgroundColor : 'white',
      borderRadius: 10,
      padding: 10,
  },
  checkboxContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
  },
  checkboxLabel: {
      marginLeft: 8,
  },
  errorMessage: {
      color: 'red',
      marginBottom: 10,
  },
  button: {
      backgroundColor: 'blue',
      paddingVertical: 12,
      paddingHorizontal: 50,
      borderRadius: 5,
      marginBottom: 20,
  },
  buttonTitle: {
      color: 'white',
      textAlign: 'center',
  },
  footerView: {
      flexDirection: 'row',
  },
  footerText: {
      fontSize: 14,
  },
  footerLink: {
      fontSize: 14,
      color: 'blue',
      marginLeft: 5,
  },
  modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      alignItems: 'center',
  },
  welcomeText: {
      fontSize: 20,
      marginBottom: 10,
  },
  usernameText: {
      fontWeight: 'bold',
  },
  cancelButton: {
      backgroundColor: 'blue',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 5,
      marginTop: 20,
  },
  cancelButtonText: {
      color: 'white',
  },
});






