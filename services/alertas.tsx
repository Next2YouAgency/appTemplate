import { Alert, BackHandler } from "react-native";

export function AlertaLocalizacao(){
  Alert.alert(
    "Permissão de Localização necessária",
    "A permissão de localização não foi encontrada, altere as configurações de permissão do aplicativo referente à localização",
    [{ text: 'Entendi', onPress: () => BackHandler.exitApp() }]
  );
}

export function AlertaErroLocalizacao(){
  Alert.alert(
    "Permissão de Localização necessária",
    "Ocorreu um erro ao tentar verificar a sua localização. Tente novamente",
    [{ text: 'Fechar', onPress: () => BackHandler.exitApp() }]
  );
}