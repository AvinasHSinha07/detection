import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PAGE_SIZE = 5; // Number of posts per page

const PostsScreen = () => {
  const navigation = useNavigation();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'posts'));
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleViewPostDetail = (postId) => {
    navigation.navigate('PostDetails', { postId });
  };

  const renderPage = ({ item }) => (
    <TouchableOpacity
      style={styles.postContainer}
      onPress={() => handleViewPostDetail(item.id)}
    >
      <Text style={styles.postText}>{item.content}</Text>
      <Text style={styles.metaText}>Timestamp: {item.timestamp.toDate().toString()}</Text>
    </TouchableOpacity>
  );

  // Paginate posts based on current page
  const paginatedPosts = posts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Posts</Text>
      <FlatList
        data={paginatedPosts}
        renderItem={renderPage}
        keyExtractor={(item) => item.id.toString()}
        style={styles.postList}
      />
      <View style={styles.paginationContainer}>
        {Array.from({ length: Math.ceil(posts.length / PAGE_SIZE) }, (_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.pageButton, currentPage === index + 1 && styles.activePageButton]}
            onPress={() => setCurrentPage(index + 1)}
          >
            <Text style={styles.pageButtonText}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddPost')}
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
    backgroundColor: '#5356FF',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    color: '#FAEF5D',
  },
  postList: {
    width: '100%',
  },
  postContainer: {
    backgroundColor: '#E5E5E5',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  postText: {
    fontSize: 16,
    marginBottom: 8,
  },
  metaText: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007BFF',
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
  paginationContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  pageButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginHorizontal: 5,
  },
  activePageButton: {
    backgroundColor: '#FAEF5D',
  },
  pageButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default PostsScreen;
