import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const Reviews = () => {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const q = query(collection(db, 'ratings'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedRatings = [];
        let totalRating = 0;
        let count = 0;

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedRatings.push({ id: doc.id, ...data });
          totalRating += data.rating; // Assuming 'rating' is a number
          count += 1; // Increment count for each rating
        });

        setRatings(fetchedRatings);

        // Calculate average rating
        if (count > 0) {
          setAverageRating(totalRating / count);
        }
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, []);

  const renderRatingItem = ({ item }) => (
    <View style={styles.ratingItem}>
      <Text style={styles.review}>⭐️ {item.rating}</Text>
      <Text style={styles.review}>{item.username}</Text>
      <Text style={styles.review}>{item.review}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>All Ratings & Reviews</Text>
      <Text style={styles.averageRating}>
        Average Rating: {averageRating.toFixed(1)} ⭐️
      </Text>
      {ratings.length > 0 ? (
        <FlatList
          data={ratings}
          renderItem={renderRatingItem}
          keyExtractor={(item) => item.id}
          style={styles.ratingList}
        />
      ) : (
        <Text>No ratings and reviews yet</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  averageRating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  ratingList: {
    marginTop: 16,
  },
  ratingItem: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
  },
  review: {
    fontSize: 16,
  },
});

export default Reviews;
