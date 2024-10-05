import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebaseConfig'; 
import { getStorage, ref, uploadBytes } from "firebase/storage";
import { ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const HomeScreen = ({ navigation }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      console.error('Permission to access media library denied');
    }
  };

  const handleDetectAnimal = () => {
    navigation.navigate('ImageDetail', { selectedImage });
    console.log('pressed');
  };

  const handleViewPosts = () => {
    navigation.navigate('Posts');
  };
  const handleReviews = () => {
    navigation.navigate('Reviews');
  };

  const handleImagePicker = async () => {
    console.log('image');
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (imageUri) => {
    try {
      const storage = getStorage();
      const imageName = imageUri.substring(imageUri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${imageName}`);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);
      console.log('Image uploaded to Firebase Storage successfully.');
    } catch (error) {
      console.error('Error uploading image to Firebase Storage:', error);
    }
  };

  const handleLocation = () => {
    navigation.navigate('Location');
  };
  const handleRating = () => {
    navigation.navigate('Rating');
  };
  const handleProfile = () => {
    navigation.navigate('UserProfile');
  };
  const handleWeather = () => {
    navigation.navigate('Weather');
  };
  const handleGraphQl = () => {
    navigation.navigate('CountryInfo');
  };


  const handleLogout = () => {
    auth.signOut().then(() => {
      console.log('User signed out successfully');
      navigation.navigate('Login');
    }).catch((error) => {
      console.error('Error signing out:', error);
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={['#1D2B53', '#2E86C1']}
        style={styles.gradient}
      >
        <Text style={styles.title}>Animal Detection App</Text>

        {/* {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImagePicker}>
          <Text style={styles.buttonText}>Select Image</Text>
        </TouchableOpacity> */}

        <TouchableOpacity style={styles.detectButton} onPress={handleDetectAnimal}>
          <Text style={styles.buttonText}>Detect Animal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.viewPostsButton} onPress={handleViewPosts}>
          <Text style={styles.buttonText}>View Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.locationButton} onPress={handleLocation}>
          <Text style={styles.buttonText}>Location</Text>
        </TouchableOpacity>
       
        <TouchableOpacity style={styles.logoutButton} onPress={handleRating}>
          <Text style={styles.buttonText}>Rate this App</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleReviews}>
          <Text style={styles.buttonText}>See Ratings and Reviews</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleProfile}>
          <Text style={styles.buttonText}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleWeather}>
          <Text style={styles.buttonText}>Weather</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleGraphQl}>
          <Text style={styles.buttonText}>Graphql</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </LinearGradient>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FAEF5D',
  },
  imagePreview: {
    width: 250,
    height: 250,
    borderRadius: 4,
    marginBottom: 16,
  },
  viewPostsButton: {
    backgroundColor: '#FF5733',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 12,
  },
  detectButton: {
    backgroundColor: '#33CC66',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 12,
  },
  imagePickerButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  logoutButton: {
    backgroundColor: '#FF5733',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 12,
  },
  locationButton: {
    backgroundColor: '#4287f5',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default HomeScreen;








