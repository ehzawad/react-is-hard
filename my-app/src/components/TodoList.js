import React, { useState, useRef, useEffect } from 'react';

function TodoList() {
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem('todos');
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [inputValue, setInputValue] = useState('');
  const [editIndex, setEditIndex] = useState(-1);
  const [editText, setEditText] = useState('');
  const [editPriority, setEditPriority] = useState('Low');
  const [addPriority, setAddPriority] = useState('Low');
  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddPriorityChange = (event) => {
    setAddPriority(event.target.value);
  };

  const handleEditPriorityChange = (event) => {
    setEditPriority(event.target.value);
  };

  const addTodo = () => {
    if (inputValue.trim() !== '') {
      const newTodo = {
        text: inputValue,
        completed: false,
        priority: addPriority,
      };
      const updatedTodos = [...todos, newTodo];
      setTodos(sortTodos(updatedTodos));
      setInputValue('');
      setAddPriority('Low');
    }
  };

  const removeTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(sortTodos(updatedTodos));
  };

  const startEdit = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
    setEditPriority(todos[index].priority);
  };

  const handleEditChange = (event) => {
    setEditText(event.target.value);
  };

  const saveTodo = (event) => {
    event.stopPropagation();
    if (editText.trim() !== '') {
      const updatedTodos = todos.map((todo, i) => {
        if (i === editIndex) {
          return { ...todo, text: editText, priority: editPriority };
        }
        return todo;
      });
      setTodos(sortTodos(updatedTodos));
      setEditIndex(-1);
      setEditText('');
      setEditPriority('Low');
    }
  };

  const cancelEdit = (event) => {
    event.stopPropagation();
    setEditIndex(-1);
    setEditText('');
    setEditPriority('Low');
  };

  const toggleCompleted = (index) => {
    const updatedTodos = todos.map((todo, i) => {
      if (i === index) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    setTodos(sortTodos(updatedTodos));
  };

  const resetTodos = () => {
    setTodos([]);
  };

  useEffect(() => {
    if (editIndex !== -1 && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editIndex]);

  const sortTodos = (todos) => {
    return todos.sort((a, b) => {
      const priorityOrder = ['High', 'Medium', 'Low'];
      return priorityOrder.indexOf(a.priority) - priorityOrder.indexOf(b.priority);
    });
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Todo List</h2>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter a todo"
          style={{
            flex: '1',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
        <select
          onChange={handleAddPriorityChange}
          value={addPriority}
          style={{
            marginLeft: '10px',
            padding: '8px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <button
          onClick={addTodo}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            marginLeft: '10px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Add Todo
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: '0' }}>
        {todos.map((todo, index) => (
          <li
            key={index}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '10px',
              backgroundColor: todo.completed ? '#f0f0f0' : 'transparent',
              padding: '10px',
              borderRadius: '4px',
            }}
          >
            {editIndex === index ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={handleEditChange}
                  ref={inputRef}
                  style={{
                    flex: '1',
                    padding: '8px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                <select
                  onChange={handleEditPriorityChange}
                  value={editPriority}
                  style={{
                    marginLeft: '10px',
                    padding: '8px',
                    fontSize: '16px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
                <button
                  onClick={saveTodo}
                  style={{
                    marginLeft: '10px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: 'transparent',
                    color: '#4caf50',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ✓
                </button>
                <button
                  onClick={cancelEdit}
                  style={{
                    marginLeft: '5px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: 'transparent',
                    color: '#f44336',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </>
            ) : (
              <>
                <span
                  onClick={() => startEdit(index)}
                  style={{
                    flex: '1',
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#888' : 'inherit',
                    cursor: 'pointer',
                  }}
                >
                  {todo.text}
                </span>
                {!todo.completed && (
                  <button
                    onClick={() => startEdit(index)}
                    style={{
                      marginLeft: '10px',
                      padding: '6px 12px',
                      fontSize: '14px',
                      backgroundColor: '#2196f3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => removeTodo(index)}
                  style={{
                    marginLeft: '5px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
                <button
                  onClick={() => toggleCompleted(index)}
                  style={{
                    marginLeft: '5px',
                    padding: '6px 12px',
                    fontSize: '14px',
                    backgroundColor: todo.completed ? '#2196f3' : '#4caf50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  {todo.completed ? 'Undo' : 'Complete'}
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <span style={{ fontSize: '14px', color: '#888' }}>
          Remaining todos: {todos.filter((todo) => !todo.completed).length}
        </span>
        <button
          onClick={resetTodos}
          style={{
            padding: '8px 16px',
            fontSize: '16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default TodoList;