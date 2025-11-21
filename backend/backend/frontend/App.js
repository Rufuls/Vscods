import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const API = 'http://192.168.1.100:3000'; // MUDE PARA SEU IP

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [streak, setStreak] = useState(0);

  const load = async () => {
    const [t, s] = await Promise.all([
      axios.get(`${API}/tasks/today`),
      axios.get(`${API}/streak`)
    ]);
    setTasks(t.data);
    setStreak(s.data.streak);
  };

  const add = async () => {
    if (!title) return;
    await axios.post(`${API}/tasks`, { title });
    setTitle('');
    load();
  };

  const toggle = async (id, completed) => {
    await axios.put(`${API}/tasks/${id}`, { completed: !completed });
    load();
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task-It</Text>
      <Text style={styles.streak}>Sequência: {streak} dias!</Text>
      <View style={styles.input}>
        <TextInput placeholder="Nova tarefa..." value={title} onChangeText={setTitle} style={styles.textInput} />
        <Button title="+" onPress={add} />
      </View>
      <FlatList
        data={tasks}
        keyExtractor={i => i.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.task, item.completed && styles.done]} onPress={() => toggle(item.id, item.completed)}>
            <Text style={item.completed && styles.line}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  streak: { fontSize: 18, color: '#e91e63', textAlign: 'center', marginBottom: 20 },
  input: { flexDirection: 'row', marginBottom: 20 },
  textInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5, marginRight: 10 },
  task: { padding: 15, backgroundColor: '#fff', marginVertical: 5, borderRadius: 8 },
  done: { backgroundColor: '#d4edda' },
  line: { textDecorationLine: 'line-through', color: '#888' }
});
