
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './screens/SplashScreen'; 
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import ImageDetailScreen from './screens/ImageDetailScreen';
import ProfileScreen from './screens/ProfileScreen';
import PostsScreen from './screens/PostsScreen';
import AddPostScreen from './screens/AddPostScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import LocationScreen from './screens/LocationScreen';
import RatingScreen from './screens/RatingScreen';
import Reviews from './screens/Reviews';
import UserProfile from './screens/UserProfile';
import Weather from './screens/WeatherUpdate';

import { ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client';
import CountryInfo from './CountryInfo';

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});
const Stack = createStackNavigator();

const App = () => {
  const [isSplashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashVisible(false);
    }, 1500);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={isSplashVisible ? 'Splash' : 'Login'}>
        {isSplashVisible ? (
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="ImageDetail" component={ImageDetailScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name='Posts' component={PostsScreen}></Stack.Screen>
            <Stack.Screen name='AddPost' component={AddPostScreen}></Stack.Screen>
            <Stack.Screen name='PostDetails' component={PostDetailScreen}></Stack.Screen>
            <Stack.Screen name='Location' component={LocationScreen}></Stack.Screen>
            <Stack.Screen name='Rating' component={RatingScreen}></Stack.Screen>
            <Stack.Screen name='Reviews' component={Reviews}></Stack.Screen>
            <Stack.Screen name='UserProfile' component={UserProfile}></Stack.Screen>
            <Stack.Screen name='Weather' component={Weather}></Stack.Screen>
            <Stack.Screen name='CountryInfo' component={CountryInfo} countryCode="US"></Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
    </ApolloProvider>
  );
};

export default App;
