import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Button, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db,storage } from '../firebaseConfig';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { getStorage, ref ,getDownloadURL} from "firebase/storage";

const UserProfile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const storageUrl = 'wild-animal-detection-28089.appspot.com';
  const storage = getStorage()

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.cancelled) {
      try {
        console.log(userData)
        const fileName = `profile/${userData.user_id}.jpg`;

        const response = await fetch(
          `https://firebasestorage.googleapis.com/v0/b/${storageUrl}/o?name=${fileName}`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'image/jpeg',
            },
            body: await fetch(result.assets[0].uri).then((response) => response.blob()),
          }
        );

        if (response.ok) {
          // Update the user data with the new image URL
          const updatedUserData = { ...userData, userProfilePic: fileName };
          setUserData(updatedUserData);

          // Update the user document in Firestore with the new image URL
          await updateDoc(doc(db, 'users', userData.user_id), { dp_url: fileName });

          // Display a success message
          Alert.alert('Success', 'Profile picture updated successfully!');
        } else {
          console.error('Error uploading image:', response.statusText);
          Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        Alert.alert('Upload Failed', 'Failed to upload image. Please try again later.');
      }
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const userEmail = auth.currentUser.email;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', userEmail));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setUserData(userData);
        const imageRef = ref(storage, `profile/${userData.user_id}.jpg`);
        // Get the download URL for the image
        console.log(imageRef)
        const url = await getDownloadURL(imageRef);
        console.log(url)
        setImageUri(url);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {userData && (
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={handleImagePick}>
            <Image source={{ uri: imageUri }} style={styles.image} />
            </TouchableOpacity>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.text}>{userData.userName}</Text>
            {/* <Text style={styles.text}>{imageUri}</Text> */}
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.text}>{userData.email}</Text>
            <Text style={styles.label}>BirthDay:</Text>
            <Text style={styles.text}>{userData.birthday}</Text>
            <Text style={styles.label}>Country:</Text>
            <Text style={styles.text}>{userData.country}</Text>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.text}>{userData.gender}</Text>
            <Text style={styles.label}>Joining Date:</Text>
            <Text style={styles.text}>{userData.joiningDate?.toDate().toString()}</Text>
            <Button title="Go Back" onPress={() => navigation.navigate('Home')} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor : '#5356FF'
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  profileContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default UserProfile;
