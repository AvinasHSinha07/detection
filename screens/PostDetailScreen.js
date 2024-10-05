import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove, addDoc, collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';

const PostDetailScreen = ({ route }) => {
  const { postId } = route.params;

  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, 'posts', postId));
        if (postDoc.exists()) {
          const postData = postDoc.data();
          setPost(postData);
          setLikeCount(postData.likes ? postData.likes.length : 0);
          setLiked(postData.likes ? postData.likes.includes(auth.currentUser.uid) : false);
          if (postData.likes) {
            setLiked(postData.likes.includes(auth.currentUser.uid));
          }
          fetchComments();
        } else {
          console.log('Post not found');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);

  const fetchComments = async () => {
    try {
      const commentsRef = collection(db, 'comments');
      const commentsQuery = query(commentsRef, where('postId', '==', postId));
      const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
        const fetchedComments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setComments(fetchedComments);
      });

      return unsubscribe;
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleLike = async () => {
    try {
      const userId = auth.currentUser.uid;
      const likesRef = doc(db, 'posts', postId);
      if (liked) {
        await updateDoc(likesRef, {
          likes: arrayRemove(userId),
        });
        setLikeCount(likeCount - 1);
      } else {
        await updateDoc(likesRef, {
          likes: arrayUnion(userId),
        });
        setLikeCount(likeCount + 1);
      }
      setLiked(!liked); 
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    try {
      const userId = auth.currentUser.uid;
      const commentData = {
        postId: postId,
        userId: userId,
        content: newComment.trim(),
        timestamp: new Date(),
      };

      await addDoc(collection(db, 'comments'), commentData);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      {post ? (
        <>
          <Text style={styles.title}>Post Detail</Text>
          <Text style={styles.postText}>{post.content}</Text>
          <Text style={styles.metaText}>Total Likes: {likeCount}</Text>
          {/* <Text style={styles.metaText}>User ID: {post.user_id}</Text> */}
          <Text style={styles.metaText}>Timestamp: {post.timestamp.toDate().toString()}</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Ionicons name={liked ? 'heart' : 'heart-outline'} size={24} color={liked ? 'red' : 'white'} />
              <Text style={styles.actionText}>{liked ? 'Liked' : 'Like'}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.actionButton} onPress={handleAddComment}>
              <Ionicons name="chatbubble-ellipses" size={24} color="green" />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity> */}
          </View>
          <FlatList
            data={comments}
            renderItem={({ item }) => (
              <View style={styles.commentContainer}>
                <Text style={styles.commentText}>{item.content}</Text>
                {/* <Text style={styles.metaText}>User ID: {item.userId}</Text> */}
              </View>
            )}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Text>No comments yet</Text>} // Add a message for empty comment list
          />
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
            />
            <TouchableOpacity style={styles.commentButton} onPress={handleAddComment}>
              <Text style={styles.commentButtonText}>Post</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>Loading post...</Text>
      )}
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
  postText: {
    fontSize: 16,
    marginBottom: 8,
    color: 'white',
  },
  metaText: {
    fontSize: 14,
    color: 'white',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    marginLeft: 5,
    color: 'white',
  },
  commentContainer: {
    backgroundColor: '#E5E5E5',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    flexDirection: 'row',
  },
  commentText: {
    fontSize: 18,
    color: 'black',
    width: '100%',
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
  },
  commentInput: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10,
    borderRadius: 8,
  },
  commentButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    marginLeft: 10,
  },
  commentButtonText: {
    color: 'white',
  },
});

export default PostDetailScreen;
