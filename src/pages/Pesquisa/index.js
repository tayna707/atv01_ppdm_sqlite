import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, TextInput, Button, Text, Alert } from 'react-native';
import { DatabaseConnection } from '../../database/database'

export default function App() {
  const db = new DatabaseConnection.getConnection;
  const [input, setInput] = useState('')
  const [resultado, setResultado] = useState([])

  const pesquisaFilme = () => {
    if (input.trim() === '' || input === null) {
      Alert.alert('Erro', 'Digite um nome válido para pesquisar o filme');
      return;
    }
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM filmes WHERE genero LIKE ? OR nome_filme LIKE ?',
        [`%${input}%`, `%${input}%`],
        (_, { rows }) => {
          setResultado(rows._array);
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Insira o nome do filme ou ID"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Pesquisar" onPress={pesquisaFilme} />
      {resultado.map(item => (
        <View key={item.id} style={styles.filmeItem}>
          <Text>ID: {item.id}</Text>
          <Text>Nome: {item.nome_filme}</Text>
          <Text>Gênero: {item.genero}</Text>
          <Text>Classificação: {item.classificacao}</Text>
          <Text>Data de Cadastro: {item.data_cad}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF69B4',
    padding: 20,
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
    width: '100%',
  },
  filmeItem: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
});