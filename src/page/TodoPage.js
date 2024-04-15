import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from '../utils/supabase'
import { CheckBox } from '@rneui/themed';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    await supabase
      .from('todo')
      .select('*')
      .eq('user_id', (await supabase.auth.getSession()).data.session.user.id)
      .then((response) => {
        setTodos(response.data ?? []);
      })
      .order('is_compeleted', { ascending: false });
  }

  const addTodo = async () => {
    //add a new todo to Supabase
    await supabase
      .from('todo')
      .insert([{
        text: newTodo,
        user_id: (await supabase.auth.getSession()).data.session.user.id,
      }])
      .then((response) => {
        fetchTodos();
      });

    setNewTodo('');
  }

  const removeTodo = async (id) => {
    //delete a todo from Supabase
    await supabase
      .from('todo')
      .delete()
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getSession()).data.session.user.id)
      .then((response) => {
        fetchTodos();
      });
  }

  const completeTodo = async (id, checked) => {
    //complete a todo from Supabase
    await supabase
      .from('todo')
      .update([{
        is_completed: !checked,
      }])
      .eq('id', id)
      .eq('user_id', (await supabase.auth.getSession()).data.session.user.id)
      .then((response) => {
        fetchTodos();
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Todo App</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter a new todo"
          value={newTodo}
          onChangeText={(text) => setNewTodo(text)}
        />
        <TouchableOpacity style={styles.addButton} onPress={addTodo}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={todos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <CheckBox
              checked={item.is_completed}
              onPress={() => completeTodo(item.id, item.is_completed)}
            />
            <Text style={styles.todoText}>{item.text}</Text>
            <TouchableOpacity onPress={() => removeTodo(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 16,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  todoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f2f2f2',
    borderRadius: 4,
  },
  todoText: {
    flex: 1,
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

export default TodoPage;