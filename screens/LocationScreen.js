import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Linking,
  TouchableOpacity,
  TextInput,
  Button,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import MapView, { Marker } from "react-native-maps";
import { FontAwesome } from "@expo/vector-icons";
import * as Location from "expo-location";

const LocationScreen = () => {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setUserLocation(location.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Watch Our Video</Text>
          <View style={styles.YTcontainer}>
            <WebView
              style={styles.video}
              javaScriptEnabled={true}
              source={{
                uri: "https://www.youtube.com/embed/K6cGZgEch-4?si=60kY6UzHtAoeGp_y",
              }}
            />
          </View>
        </View>
        <View style={styles.mapContainer}>
          <Text style={styles.subHeading}>Location</Text>
          {userLocation && (
            <MapView
              style={styles.map}
              region={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude,
                }}
                title="Current Location"
              />
            </MapView>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  YTcontainer: {
    borderRadius: 10,
    overflow: "hidden",
  },
  video: {
    height: 250,
    width: "100%",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e80505",
    paddingTop: 30,
  },
  videoContainer: {
    marginBottom: 20,
  },
  subHeading: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 12,
    color: "#28a745",
  },
  video: {
    height: 200,
    width: Dimensions.get("window").width - 40,
  },
  mapContainer: {
    backgroundColor: "white",
    marginVertical: 10,
    padding: 10,

    borderColor: "#e80505",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  map: {
    height: 200,
    borderRadius: 10,
  },
  paragraph: {
    fontSize: 16,
    marginBottom: 12,
  },
  socialMediaContainer: {
    marginTop: 20,
  },
  socialMediaLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginHorizontal: 10,
  },
  ratingContainer: {
    marginTop: 20,
    alignItems: "left",
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 5,
  },
  submitButton: {
    marginTop: 10,
    fontSize: 18,
    color: "#007bff",
    textDecorationLine: "underline",
  },
  reviewContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  reviewInput: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    padding: 10,
    textAlignVertical: "top",
    width: "100%",
  },
  reviewsContainer: {
    marginTop: 20,
  },
  reviewItem: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  reviewRating: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  reviewText: {
    fontSize: 14,
  },
});

export default LocationScreen;
