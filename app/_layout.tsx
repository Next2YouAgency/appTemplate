import { Stack, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Location from 'expo-location';

// import 'react-native-reanimated';

import { Alert, BackHandler, useColorScheme } from 'react-native';
import { AlertaErroLocalizacao } from '../services/alertas';
import { createOfflineTables } from '../services/createOffilineTables';

SplashScreen.preventAutoHideAsync();

export default function RootLayout (){

  const [isAppReady, setAppReady] = useState(false);


  useEffect(()=>{

    const solicitarPermissaoLocalizacao = async () => {

      try {
        const {status} = await Location.requestForegroundPermissionsAsync();

        if(status !== 'granted'){ 
          AlertaErroLocalizacao(); 
          return;
        }

        prepare()
        
      } catch (error) { AlertaErroLocalizacao(); }

    }


    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      //Executar alguma animação (verificar) antes de finalizar o SplashScreen

      // await new Promise(resolve=>setTimeout(() => { resolve}, 2000));

      setAppReady(true);

      await SplashScreen.hideAsync();
    }

    /** Efetuar/Verificar solcitação da permissão */
    solicitarPermissaoLocalizacao();

    /** Criação de tabelas offline com sqlite */
    createOfflineTables();

  });

  if(!isAppReady){ return null; }



  return (
    <Stack
      screenOptions={{ 
        headerStyle: {
          backgroundColor: "#614897"
        },
        headerTintColor: "#fff"
      }}
      initialRouteName='index'
    >
      <Stack.Screen name="index" options={{ title: "Login", headerShown: false }}/>
      <Stack.Screen name="profile" options={{ title: "Perfil" }}/>
      <Stack.Screen name="user/[id]" options={{ title: "Usuário" }}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
      
    </Stack>
  );
}