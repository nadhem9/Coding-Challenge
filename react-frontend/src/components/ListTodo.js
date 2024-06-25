import React from 'react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TodoList = () => {
  const [todo, setTodo] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null); 
  const inputRef = useRef();

  useEffect(() => {
    fetchTodoList();
  }, []);

  const fetchTodoList = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/todo');
      setTodo(response.data);
    } catch (error) {
      console.error('Error fetching todo list:', error);
    }
  };

  const handleClick = async () => {
    const text = inputRef.current.value;
    if (text.trim() === '') return;

    if (editingIndex !== null) {
     
      try {
        await axios.put(`http://localhost:5000/api/todo/${todo[editingIndex]._id}`, { text });
        const updatedTodo = [...todo];
        updatedTodo[editingIndex].text = text;
        setTodo(updatedTodo);
        setEditingIndex(null);
      } catch (error) {
        console.error('Error updating todo:', error);
      }
    } else {
      try {
        const response = await axios.post('http://localhost:5000/api/todo', { text, status: 'pending' });
        setTodo([response.data, ...todo]);
      } catch (error) {
        console.error('Error adding todo:', error);
      }
    }
    inputRef.current.value = '';
  };

  const toggleStatus = async (index) => {
    const newTodo = [...todo];
    const updatedStatus =
      newTodo[index].status === 'pending'
        ? 'in-progress'
        : newTodo[index].status === 'in-progress'
        ? 'complete'
        : 'complete';
  
    try {
      await axios.put(`http://localhost:5000/api/todo/${newTodo[index]._id}`, { status: updatedStatus });
      newTodo[index].status = updatedStatus;
  
      
      newTodo.sort((a, b) => {
        if (a.status === 'complete' && b.status !== 'complete') {
          return 1;
        }
        if (a.status !== 'complete' && b.status === 'complete') {
          return -1;
        }
        return 0;
      });
  
      setTodo(newTodo);
    } catch (error) {
      console.error('Error updating todo status:', error);
    }
  };
  

  const deleteTodo = async (index) => {
    try {
      await axios.delete(`http://localhost:5000/api/todo/${todo[index]._id}`);
      const newTodo = [...todo];
      newTodo.splice(index, 1);
      setTodo(newTodo);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  const editTodo = (index) => {
    inputRef.current.value = todo[index].text;
    setEditingIndex(index);
  };
  return (
    <div className="container">
        <ul>
          {todo.map(({ text, status }, index) => (
            <div className="item" key={index}>
              <li className={status}>
                {text}
                <span className="status-icon" onClick={() => toggleStatus(index)}>
                  {status === 'pending' && '⏳(pending)'}
                  {status === 'in-progress' && '🔄(in-progress)'}
                  {status === 'complete' && '✅(complete)'}
                </span>
              </li>
              <div>
                <span className="edit-text" onClick={() => editTodo(index)}>
                  ✏️
                </span>
                <span className="trash" onClick={() => deleteTodo(index)}>
                  🗑️
                </span>
              </div>
            </div>
          ))}
        </ul>
        <input ref={inputRef} placeholder="Enter items..." />
        <button onClick={handleClick}>{editingIndex !== null ? 'Update' : 'Add Task'}</button>
      </div>
  );
};

export default TodoList;
