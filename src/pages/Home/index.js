import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DatabaseConnection } from '../../database/database';
import { useNavigation } from "@react-navigation/native";

export default function Home() {
    const db = new DatabaseConnection.getConnection; 
    const navigation = useNavigation();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        db.transaction(tx => {
          tx.executeSql(
            'CREATE TABLE IF NOT EXISTS filmes (id INTEGER PRIMARY KEY AUTOINCREMENT, nome_filme TEXT NOT NULL, genero TEXT NOT NULL, classificacao TEXT NOT NULL, data_cad TEXT NOT NULL)',
            [], 
            () => console.log('Tabela criada com sucesso!'),
            (_, error) => console.error(error) 
          );
        });
      }, [todos]);

    function Cadastro() {
        navigation.navigate('Cadastro')
    }

    function Registros() {
        navigation.navigate('Registros')
    }

    function Pesquisa() {
        navigation.navigate('Pesquisa')
    }

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeAreaView}>
                <Text style={styles.title}>Catálogo de Filmes</Text>
                <TouchableOpacity style={styles.button} onPress={() => Cadastro()}>
                    <Text style={styles.buttonText}>Cadastrar um novo Filme</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => Registros()}>
                    <Text style={styles.buttonText}>Todos os filmes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => Pesquisa()}>
                    <Text style={styles.buttonText}>Pesquisar um filme</Text>
                </TouchableOpacity>
            </SafeAreaView>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'pink',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
  
    },
    safeAreaView: {
        width: '80%',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 40,
        textAlign: 'center',
    },
    button: {
        backgroundColor: 'purple',
        marginBottom: 28,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 15,
        textAlign: 'center',
    },
});