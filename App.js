import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import Home from './src/pages/Home';
import Cadastro from './src/pages/Cadastro';
import Registros from './src/pages/Registros';
import Pesquisa from './src/pages/Pesquisa';

const Stack = createNativeStackNavigator();

export default function app() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          component={Home}
        />
        <Stack.Screen
          name='Cadastro'
          component={Cadastro}
        />
        <Stack.Screen
          name='Registros'
          component={Registros}
        />
        <Stack.Screen
          name='Pesquisa'
          component={Pesquisa}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )


}