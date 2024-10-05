import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { serverTimestamp, addDoc, collection, updateDoc, doc, getDoc, query, where, getDocs } from 'firebase/firestore'; 
import { auth, db } from '../firebaseConfig';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const RatingScreen = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [userName, setUsername] = useState('');

  useEffect(() => {
    // Fetch username when component mounts
    const fetchUsername = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userEmail = user.email;
          const usersRef = collection(db, 'users');
          const userQuerySnapshot = await getDocs(query(usersRef, where('email', '==', userEmail)));

          if (!userQuerySnapshot.empty) {
            // Assuming email is unique, only one document is expected
            const userData = userQuerySnapshot.docs[0].data();
            setUsername(userData.userName || 'Unknown');
          } else {
            console.error('User document not found');
          }
        } else {
          console.error('User not authenticated');
        }
      } catch (error) {
        console.error('Error fetching username:', error);
      }
    };

    fetchUsername();
  }, []);

  const handleAddRating = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not authenticated');
        return;
      }

      // Add rating data to Firestore
      await addDoc(collection(db, 'ratings'), {
        userId: user.uid,
        rating: rating,
        username: userName,
        review: review.trim(),
        timestamp: serverTimestamp(), 
      });

      console.log('Rating added successfully');

      // Reset state
      setRating(0);
      setReview('');

      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error adding rating:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Rating & Review</Text>
      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity 
            key={star} 
            style={[styles.star]} 
            onPress={() => setRating(star === rating ? 0 : star)}
          >
            <FontAwesomeIcon icon={star <= rating ? solidStar : regularStar} size={30} color="#FFD700" />
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Write your review"
        value={review}
        onChangeText={setReview}
        multiline
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={handleAddRating}
        disabled={!review.trim()}
      >
        <Text style={styles.buttonText}>Submit Rating & Review</Text>
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
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  star: {
    marginRight: 5,
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

export default RatingScreen;
