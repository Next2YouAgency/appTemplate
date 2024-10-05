import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import { styles } from './user/styles';
import { useState } from 'react';
import { salvarUsuarios, verificarUsuarioExiste } from '../services/db';
import { urlApi } from '../services/urlData';

export default function Login() {
  const [ambiente, setAmbiente] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [dbname, setDbname] = useState('');
  const [bd_user, setbd_user] = useState('');
  const [bd_pass, setbd_pass] = useState('');
  const [error, setError] = useState('');



  const autenticarUsuarioLocal = async () => {
    verificarUsuarioExiste(username, password, ambiente, (existe: boolean) => {
      if (existe) {
        //Usuário encontrado no banco local, navegar para tela home
        console.log(`Usuário ${username} encontrado no banco local.`);
        router.replace('(Tabs)/dashboard');
      } else {
        //usuário não encontrado no banco local, buscar no banco em produção
        console.log(`Usuário ${username} não encontrado localmente, tentando em produção.`);
        checarAmbiente();
      }
    });
  }

  const autenticarUsuario = async (dbname: string, bd_user: string, bd_pass: string) => {

    //Autenticar usuário no banco de dados do cliente informado no ambiente
    const urlAuth = `${urlApi}/clientes/conectacliente`;
    //body da requisição POST
    const bodyReq = JSON.stringify({
      usuario: username,
      senha: password,
      ambiente: ambiente,
      banco: dbname,
      bd_user: bd_user,
      bd_pass: bd_pass
    });

    try {
      
      //Executar o envio
      const response = await fetch(urlAuth,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: bodyReq,
      });

      //Se não conseguir uma resposta do servidor
      if (!response.ok) { throw new Error(`Erro de resposta do servidor: ${response.status}`); }

      //Armazenar texto respondido pela API
      const textResponse = await response.text();

      //Transformar em JSON
      const data = JSON.parse(textResponse);

      if(data[0]){
        //Login do usuário existe, buscar todos os usuários para salvar offline
        const urlTodos = `${urlApi}/clientes/todosusuarios`;
        const bodyReqTodos = JSON.stringify({
          ambiente: ambiente,
          banco: dbname,
          bd_user: bd_user,
          bd_pass: bd_pass
        });

        //Executar o POST
        const responseTodos = await fetch(urlTodos, { method: "POST", headers: { "Content-Type": "application/json" }, body: bodyReqTodos, });

        //Se houver erro ao buscar todos os usuários
        if (!responseTodos.ok) { { throw new Error("Erro ao buscar todos os usuários"); } }

        //Armazenar o resultado em Text
        const textResponseTodos = await responseTodos.text();
        
        //converter o resultado da API para JSON
        const dataTodos = JSON.parse(textResponseTodos);

        //adicionar campo "ambiente" para cada usuário da lista
        const usuarioComAmbiente = dataTodos.map((usuario: any) => ({
          ...usuario,
          ambiente: ambiente //Adiciona o ambiente ao objeto usuário
        }));

        salvarUsuarios(usuarioComAmbiente);

        router.replace('(tabs)/dashboard/index');

      } else { alert(`Erro ao tentar efetuar login, credenciais Inválidas. Tente novamente.`); }


    }catch (error) { console.error("Erro ao autenticar o usuário: ", error); }


  }

  const checarAmbiente = async () => {
    const ambienteBase64 = btoa(ambiente);
    const url = `${urlApi}/clientes/?YW1i=${ambienteBase64}`;

    // console.log(url);
    try {
      //Executar envio para API
      const response = await fetch(url,{
        method: "GET",
        headers: { 'Content-Type': 'application/json' },
      });

      //Se não conseguir uma resposta do servidor
      if (!response.ok) { throw new Error(`Erro de resposta do servidor: ${response.status}`); }

      //Converter a resposta da API para JSON
      const data = await response.json();

      if(data[0].dbname){

        //Armazenar dados para tentar fazer login do usuário no banco do cliente
        setDbname(data[0].dbname);
        setbd_user(data[0].bd_user);
        setbd_pass(data[0].bd_pass);

        autenticarUsuario(data[0].dbname, data[0].bd_user, data[0].bd_pass);

      }else{
        alert(`Ambiente não disponível para acesso`);
      }

    } catch (error) { alert(`Ambiente não disponível para acesso.`); }
    
  }


  const handleLogin = () =>{
    //Iniciar autenticação do usuário
    autenticarUsuarioLocal();
  }


  return (
    <View style={styles.container}>
      <Text style={styles.label}>Login</Text>
      {/* <Link href={'/profile'}>Ir para tela Profile</Link>
      <Link href={"/user/123456"}>Ir para tela Usuário</Link> */}

      <View style={styles.boxLogin}>

        <Text style={[styles.label, styles.labelInput]}>Ambiente: </Text>
        <TextInput
          placeholder='Ambiente'
          value={ambiente}
          onChangeText={setAmbiente}
          style={styles.TextInput}
        />

        <Text style={[styles.label, styles.labelInput]}>Usuário: </Text>
        <TextInput
          placeholder='Usuario'
          value={username}
          onChangeText={setUsername}
          style={styles.TextInput}
        />

        <Text style={[styles.label, styles.labelInput]}>Senha: </Text>
        <TextInput
          placeholder='* * * * *'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.TextInput}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.boxBotoes}>

          <TouchableOpacity style={styles.button} onPress={ handleLogin }>
          {/* <TouchableOpacity style={styles.button} onPress={ () => router.replace('(tabs)/dashboard') }> */}
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() =>{ alert("Habilitar esqueci senha") }}>
            <Text style={[styles.colorPrimary, styles.textCenter]}>Esqueci a Senha</Text>
          </TouchableOpacity>

        </View>



      </View>

      <View style={styles.bottomCredits}>
        <Text style={styles.textBottomCredits}>AppName</Text>
        <Text style={styles.textBottomCredits}>V0.0.1</Text>
      </View>


      <StatusBar style="auto" />
    </View>
  );
}
