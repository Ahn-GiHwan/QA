import styled from 'styled-components/native';
import {Itheme} from './theme';

export const ThemeSafeAreaView = styled.View`
  background-color: ${({theme}: {theme: Itheme}) => theme.bg && theme.bg};
`;

export const ThemeView = styled.View`
  background-color: ${({theme}: {theme: Itheme}) => theme.bg && theme.bg};
`;

export const ThemeText = styled.Text`
  color: ${({theme}: {theme: Itheme}) => theme.text && theme.text};
`;

export const ThemeTextInput = styled.TextInput.attrs({
  importantForAutofill: 'yes',
  placeholderTextColor: 'gray',
})`
  color: ${({theme}: {theme: Itheme}) => theme.text && theme.text};
`;
