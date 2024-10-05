import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { serverTimestamp, addDoc, collection, update, updateDoc } from 'firebase/firestore'; // Importing serverTimestamp and addDoc
import { auth, firestore,db } from '../firebaseConfig'; 
const AddPostScreen = ({ navigation }) => {
  const [postText, setPostText] = useState('');

  const handleAddPost = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      const userId = user.uid;
      const content = postText.trim();

    
      const docRef = await addDoc(collection(db, 'posts'), {
        user_id: userId,
        content: content,
        timestamp: serverTimestamp(), 
      });

      await updateDoc(docRef,{ postId: docRef.id });

      console.log('Post added successfully with ID:', docRef.id);

      setPostText('');
      navigation.goBack();
    } catch (error) {
      console.error('Error adding post:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your post here"
        value={postText}
        onChangeText={setPostText}
        multiline
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddPost}
        disabled={!postText.trim()}
      >
        <Text style={styles.buttonText}>Add Post</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1D2B53',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FAEF5D',
  },
  input: {
    backgroundColor: 'white',
    width: '100%',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default AddPostScreen;
