import { StyleSheet, Text, View, StatusBar } from 'react-native'
import {
  useFonts, 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold, 
  Inter_800ExtraBold
} from '@expo-google-fonts/inter';

import { Loading } from './src/components/loading';

export default function App() {
  //Carregando as fontes na nossa aplicação para dizermos que serão elas que iremos utilizar 
  //Obs: precisamos garantir que a nossa aplicaçao carregue as fontes antes do app ser exibido pro usuário. Por isso
  //utilizo o [fontsLoaded] que é valor booleano que vai nos dizer se essa fonte esta carregada ou nao no dispositivo 
  const [fontsLoaded] = useFonts({
    Inter_400Regular, 
    Inter_600SemiBold, 
    Inter_700Bold, 
    Inter_800ExtraBold
  });

  //Se a fonte nao estiver carregada, nos retornamos um componente loading ja que nao queremos que siga com o rumo 
  //da nossa aplicação
  if(!fontsLoaded) {
    return (
      <Loading />
    );
  }

  return (
    <View style={styles.container}> {/*Aqui colocamos propriedades para o view*/}
      <Text style={styles.text}>Open up App.tsx to start working on your app!</Text>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent/> {/*Informaçoes especificas para o dispositivo mobile*/}
    </View>
  );
}

//Regras de estilizacao que podemos utilizar no react native  
//Lembrar: Propriedades em formato de texto com aspas simples ou dupla e prorpiedades numericas apenas o numero resolve
const styles = StyleSheet.create({
  container: {
    flex: 1, //No react native o flex (box) já é ativo por padrão 
    backgroundColor: '#09090A', //Na web utilariamos backgroud-color com um tracinho
    alignItems: 'center', 
    justifyContent: 'center',
  },
  text: {
    color: 'red',
    fontFamily: 'Inter_800ExtraBold'
  }
});
