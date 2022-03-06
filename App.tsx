import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {ThemeProvider} from 'styled-components/native';
import {NavigationContainer} from '@react-navigation/native';
import {lightTheme, darkTheme} from './src/style/theme';
import {QueryClient, QueryClientProvider} from 'react-query';
import AppInner from './AppInner';
import {Provider} from 'react-redux';
import store from './src/redux';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <NavigationContainer>
        <StatusBar barStyle={'dark-content'} />
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <AppInner />
          </Provider>
        </QueryClientProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
export default App;
