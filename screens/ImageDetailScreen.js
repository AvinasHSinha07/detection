import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator,ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as tf from "@tensorflow/tfjs";
import { bundleResourceIO, decodeJpeg } from "@tensorflow/tfjs-react-native";
import * as FileSystem from 'expo-file-system';

const modelJson = require("../assets/trained_model/model.json")
const modelWeights = require("../assets/trained_model/weights.bin")

const datasetClasses = [
  "tiger",
  "lion",
  "elephant",
  "bear",
 
];

const transformImageToTensor = async (uri) => {
  const img64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const imgBuffer = tf.util.encodeString(img64, "base64").buffer;
  const raw = new Uint8Array(imgBuffer);
  let imgTensor = decodeJpeg(raw);
  const scalar = tf.scalar(255);
  imgTensor = tf.image.resizeNearestNeighbor(imgTensor, [224, 224]);
  const tensorScaled = imgTensor.div(scalar);
  const img = tf.reshape(tensorScaled, [1, 224, 224, 3]);
  return img;
};

const ImageDetailScreen = () => {
  const [imageUri, setImageUri] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [galleryPermission, setGalleryPermission] = useState(null);
  const [model, setModel] = useState();
  


  useEffect(() => {
    (async () => {
      const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
      const galleryPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setCameraPermission(cameraPermission.status === 'granted');
      setGalleryPermission(galleryPermission.status === 'granted');
    })();
  }, []);




const pickImage = async () => {
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [4, 4],
    quality: 1,
  });

  if (!result.canceled) {
    setSelectedImage(result.assets[0].uri);
    setImageUri(result.assets[0].uri);
   
    setLoading(true);
      await tf.ready();
      const model = await tf.loadLayersModel(
        bundleResourceIO(modelJson, modelWeights)
      );
      setModel(model);

      const imageTensor = await transformImageToTensor(result.assets[0].uri);
      const predictions = model.predict(imageTensor);
      const highestPredictionIndex = predictions.argMax(1).dataSync();
      const predictedClass = `${datasetClasses[highestPredictionIndex]}`;
      console.log(predictedClass);
      setPrediction(predictedClass);
      setLoading(false);
  }
};

 
  
  return (
   
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <Text style={styles.placeholderText}>No Image Selected</Text>
        )}
      </View>
      <View style={styles.buttonContainer}>
      
        <TouchableOpacity style={styles.button} onPress={pickImage}>
          <Text style={styles.buttonText}>Choose from Gallery</Text>
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : (
        <Text style={styles.predictionText}>{prediction}</Text>
      )}
    </View>
   
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  
  
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderText: {
    fontSize: 16,
    color: '#757575',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    gap:20,
  },
  button: {
    backgroundColor: '#38598b',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  predictionText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
  },
});

export default ImageDetailScreen;