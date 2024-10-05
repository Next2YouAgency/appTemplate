import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite/legacy';
import { Asset } from 'expo-asset';

const databaseName = "BancoLocal";

async function openDatabase(pathToDatabaseFile: string): Promise<SQLite.SQLiteDatabase> {
  if (!(await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'SQLite')).exists) {
    await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'SQLite');
  }
  const asset = await Asset.fromModule(pathToDatabaseFile).downloadAsync();
  await FileSystem.copyAsync({
    from: asset.localUri,
    to: FileSystem.documentDirectory + 'SQLite/'+databaseName+'.db',
  });
  return SQLite.openDatabase(databaseName +'.db');
}


//Abrir (ou criar) banco de dados
const db = SQLite.openDatabase(databaseName + '.db', '0.0.1');


//Criar as tabelas se não existirem
export const createUserTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS usuarios (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         nome TEXT,
         email TEXT,
         senha TEXT,
         ambiente TEXT
       );`,
      [],
      () => console.log('Tabela de usuários criada com sucesso'),
      () => true
    );
  });
};

//Função para criar a tabela de Artigos
export const createArtigosTable = () => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS artigos (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         id_pagina int,
         id_categoria int,
         titulo TEXT,
         subtitulo TEXT,
         imagem_artigo TEXT,
         conteudo_artigo BLOB,
         usuario_criador TEXT,
         ativo INT
       );`,
      [],
      () => [true, console.log('Tabela de artigos criada com sucesso')],
      () => true
    );
  });
}

//apagar as tabelas que existirem
export const dropTables = () => {
  db.transaction(tx => {
    tx.executeSql(
      `DROP TABLE IF EXISTS usuarios;`,
      [],
      () => console.log('Tabela de usuários excluida com sucesso'),
      () => true
    );
  });
};

//apagar o banco de dados
export const dropDatabase = async () => {
  const databaseFilePath = `${FileSystem.documentDirectory}Sqlite/${databaseName}.db`;

  try {
    await FileSystem.deleteAsync(databaseFilePath);
  } catch (error) {
    console.log(`Erro ao excluir o banco de dados: ${error}`);    
  }
  
}

// Função para salvar usuários
export const salvarUsuarios = (usuarios: any[]) => {

  usuarios.forEach(usuario => {
    verificarUsuarioExiste(usuario.email, usuario.senha, usuario.ambiente, (existe: boolean) => {
      if (!existe) {
        db.transaction(tx => {
          tx.executeSql(
            `INSERT INTO usuarios (nome, email, senha, ambiente) VALUES (?, ?, ?, ?);`,
            [usuario.nome, usuario.email, usuario.senha, usuario.ambiente],
            () => console.log(`Usuário ${usuario.email} do ambiente ${usuario.ambiente} salvo com sucesso`),
            (_, error) => console.log('Erro ao salvar usuário', error)
          );
        });
      } else {
        console.log(`Usuário ${usuario.email} já existe, não será adicionado novamente`);
      }
    });
  });
  
};





// Função para buscar todos os usuários
export const buscarUsuarios = (callback: Function) => {
  db.transaction(tx => {
    tx.executeSql(
      'SELECT * FROM usuarios;',
      [],
      (_, { rows }) => {
        callback(rows._array); // Retorna todos os usuários encontrados
      },
      (_, error) => {
        console.error('Erro ao buscar usuários', error);
        callback([]);
      }
    );
  });
};



export const verificarUsuarioExiste = (email: string, senha:string, ambiente:string, callback: Function) => {
  console.log(email);
  console.log(senha);
  console.log(ambiente);
  
  db.transaction(tx => {
    tx.executeSql(
      'SELECT id FROM usuarios WHERE email = ? AND senha = ? AND ambiente = ?;',
      [email, senha, ambiente],
      (_, { rows }) => {
        callback(rows.length > 0); // Verifica se algum registro foi encontrado
      },
      (_, error) => {
        console.error('Erro ao verificar se o usuário já existe', error);
        callback(false);
      }
    );
  });
};