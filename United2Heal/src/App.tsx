/* eslint-disable prettier/prettier */
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider } from 'react-native-paper';
import MainTabNavigator from './navigation/MainTabNavigator';
import WelcomePage from './screens/WelcomePage';
import AdminScreen from './screens/AdminScreen';
import VolunteerLogin from './components/VolunteerLogin';
import AdminTabNavigator from './navigation/AdminTabNavigator';
import LogoutContext from './navigation/LogoutContext';
import GoogleSheetsPage from './screens/GoogleSheetsPage'; 

const LoginNavigationStack = createNativeStackNavigator();

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAdmin(false);
    // Add navigation reset if required
  };

  const handleLogin = (isUserAdmin: boolean) => {
    setIsLoggedIn(true);
    setIsAdmin(isUserAdmin);
  };

  return (
    <PaperProvider>
      <NavigationContainer>
        {!isLoggedIn ? (
          <LoginNavigationStack.Navigator initialRouteName="Welcome">
            <LoginNavigationStack.Screen name="Welcome" component={WelcomePage} />
            <LoginNavigationStack.Screen name="AdminScreen">
              {() => <AdminScreen onLogin={() => handleLogin(true)} />}
            </LoginNavigationStack.Screen>
            <LoginNavigationStack.Screen name="VolunteerLogin">
              {() => <VolunteerLogin onLogin={() => handleLogin(false)} />}
            </LoginNavigationStack.Screen>
          </LoginNavigationStack.Navigator>
        ) : (
          <LogoutContext.Provider value={{ handleLogout }}>
            {isAdmin ? (
              <LoginNavigationStack.Navigator initialRouteName="AdminTabNavigator">
                <LoginNavigationStack.Screen name="AdminTabNavigator" component={AdminTabNavigator} />
                <LoginNavigationStack.Screen name="GoogleSheetsPage" component={GoogleSheetsPage} />
              </LoginNavigationStack.Navigator>
            ) : (
              <MainTabNavigator onLogout={handleLogout} />
            )}
          </LogoutContext.Provider>
        )}
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
