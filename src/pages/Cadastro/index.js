import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Alert, TextInput, Button } from 'react-native';
import { DatabaseConnection } from '../../database/database';
import { Picker } from '@react-native-picker/picker';

export default function App() {
    const db = new DatabaseConnection.getConnection;
    const [filme, setFilme] = useState('');
    const [classificacao, setClassificacao] = useState('');
    const [categoria, setCate] = useState('');
    // const [enable, setEnable] = useState ('filmes')

    const adicionaFilme = () => {
        if (filme.trim() === '' || filme === null) {
            Alert.alert('Erro', 'Insira um texto válido para o nome do filme');
            return;
        }
        if (classificacao.trim() === '' || classificacao === null) {
            Alert.alert('Erro', 'Selecione uma classificação para o filme');
            return;
        }
        if (categoria.trim() === '' || categoria === null) {
            Alert.alert('Erro', 'Selecione uma categoria para o filme');
            return;
        }

        const dataAtual = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

        db.transaction(
            tx => {
                tx.executeSql(
                    'INSERT INTO filmes (nome_filme, genero, classificacao, data_cad) VALUES (?, ?, ?, ?)',
                    [filme, categoria, classificacao, dataAtual],
                    (_, { rowsAffected }) => {
                        console.log(rowsAffected);
                        setFilme('');
                        setCate('');
                        setClassificacao('');
                    },
                    (_, error) => {
                        console.error('Erro ao adicionar o filme', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao adicionar o filme');
                    }
                );
            }
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cadastre um novo filme</Text>

            <TextInput
                style={styles.input}
                value={filme}
                onChangeText={setFilme}
                placeholder="Digite um novo Filme"
            />

            <TextInput
                style={styles.input}
                value={classificacao}
                onChangeText={setClassificacao}
                placeholder='Digite a classificação'></TextInput>

            <TextInput
                style={styles.input}
                value={categoria}
                onChangeText={setCate}
                placeholder='Digite a categoria'></TextInput>

            <Button title="Adicionar" onPress={adicionaFilme} />

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D8BFD8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
    },
    title: {
        fontSize: 15,
        marginBottom: 15,
    },
    input: {
        width: '100%',
        // height: 50,
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
});