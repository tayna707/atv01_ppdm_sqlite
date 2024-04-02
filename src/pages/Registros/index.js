import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Modal, Button, TextInput } from 'react-native';
import { DatabaseConnection } from '../../database/database'
import { getStatusBarHeight } from 'react-native-status-bar-height';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome5';
import { Picker } from '@react-native-picker/picker';

export default function App() {
    const db = new DatabaseConnection.getConnection;
    const [todos, setTodos] = useState([]);
    const [filme, setFilme] = useState('');
    const [genero, setGenero] = useState('');
    const [classificacao, setClassificacao] = useState('');
    const [id, setId] = useState('');
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        atualizaRegistros();
    }, []);

    const atualizaRegistros = () => {
        try {
            db.transaction(tx => {
                tx.executeSql('SELECT * FROM filmes',
                    [], (_, { rows }) =>
                    setTodos(rows._array),
                );
            });
        } catch (error) {
            console.error('Erro ao buscar os filmes', error);
        }
    };


    const excluirFilme = id => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'DELETE FROM filmes WHERE id = ?',
                    [id], (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaRegistros();
                            Alert.alert('Info', 'Registro excluído com sucesso.');
                        } else {
                            Alert.alert('Erro', 'Nenhum registro foi excluído');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao excluir o filme:', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao excluir o filme.');
                    }
                );
            }
        );
    };

    const handleEditPress = (nomeFilme, id, genero, classificacao) => {
        setFilme(nomeFilme);
        setId(id);
        setGenero(genero);
        setClassificacao(classificacao);
        setModalVisible(true);
    };
    const salvarEdicao = () => {
        db.transaction(
            tx => {
                tx.executeSql(
                    'UPDATE filmes SET nome_filme = ?, classificacao = ?, genero = ? WHERE id = ?',
                    [filme, classificacao, genero, id],
                    (_, { rowsAffected }) => {
                        if (rowsAffected > 0) {
                            atualizaRegistros();
                            setModalVisible(false)
                            Alert.alert('Info', 'O filme foi editado com sucesso');
                        } else {
                            Alert.alert('Erro', 'O filme não foi encontrado');
                        }
                    },
                    (_, error) => {
                        console.error('Erro ao editar o filme', error);
                        Alert.alert('Erro', 'Ocorreu um erro ao editar o filme');
                    }
                );
            }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                <View style={styles.containerScroll}>
                    {todos.map(item => (
                        <View key={item.id} style={styles.filmeItem}>
                            <Text style={styles.filmeItemText}>ID: {item.id}</Text>
                            <Text style={styles.filmeItemText}>NOME: {item.nome_filme}</Text>
                            <Text style={styles.filmeItemText}>GENERO: {item.genero}</Text>
                            <Text style={styles.filmeItemText}>CLASSIFICAÇÂO: {item.classificacao}</Text>
                            <Text style={styles.filmeItemText}>DATA DE CADASTRO: {item.data_cad}</Text>
                            <View style={styles.buttonsContainer}>
                                <TouchableOpacity onPress={() => {
                                    Alert.alert(
                                        "Atenção!",
                                        'Deseja excluir o registro selecionado?',
                                        [
                                            {
                                                text: 'OK',
                                                onPress: () => excluirFilme(item.id)
                                            },
                                            {
                                                text: 'Cancelar',
                                                onPress: () => { return },
                                                style: 'cancel',
                                            }
                                        ],
                                    )
                                }}>
                                    <FontAwesome6 name='trash' color={'red'} size={25} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleEditPress(item.nome_filme, item.id, item.genero, item.classificacao)}>
                                    <FontAwesome6 name='pen-square' color={'green'} size={25} />
                                </TouchableOpacity>

                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text>Editando Filme</Text>
                        <TextInput
                            style={styles.input}
                            value={filme}
                            onChangeText={setFilme}

                        />
                        <Text>Editando classificação</Text>
                        <TextInput
                            style={styles.input}
                            value={genero}
                            onChangeText={setGenero}

                        />
                        <Text>Editando gênero</Text>
                        <TextInput
                            style={styles.input}
                            value={classificacao}
                            onChangeText={setClassificacao}
                        />

                        <View style={styles.saveButton}>
                            <Button title="Salvar" onPress={() => {
                                salvarEdicao()
                                setModalVisible(false);

                            }} />
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} />
                        </View>
                    </View>
                </View>
            </Modal>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'purple',
        padding: 20,
    },
    containerScroll: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    filmeItem: {
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'puple',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
    },
    filmeItemText: {
        color: '#fff',
        fontSize: 18,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#EAADEA',
        borderRadius: 20,
        padding: 20,
        width: '80%',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.7,
        shadowRadius: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: 'purple',
        borderRadius: 10,
        padding: 15,
        marginBottom: 20,
        width: '100%',
        backgroundColor: 'black',
        color: 'white',
        fontSize: 16,

    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '50%',
    },
    saveButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});
