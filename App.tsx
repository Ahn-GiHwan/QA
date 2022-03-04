import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {NavigationContainer} from '@react-navigation/native';
import NativeStack from './src/navigation/NativeStack';
import {lightTheme, darkTheme} from './src/style/theme';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <NavigationContainer>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <NativeStack />
      </NavigationContainer>
    </ThemeProvider>
  );
}
export default App;
