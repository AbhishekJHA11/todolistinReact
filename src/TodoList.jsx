import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import DatePicker from "react-datepicker"; // Import DatePicker for due dates
import "react-datepicker/dist/react-datepicker.css"; // Import DatePicker styles
import "./TodoList.css";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [dueDate, setDueDate] = useState(null);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: Date.now().toString(),
          text: inputValue,
          completed: false,
          dueDate: dueDate,
        },
      ]);
      setInputValue("");
      setDueDate(null); // Reset date picker
    }
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // Drag & Drop Handling
  const handleDragEnd = (result) => {
    if (!result.destination) return; // If dropped outside the list, do nothing

    const updatedTodos = [...todos];
    const [reorderedItem] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, reorderedItem);

    setTodos(updatedTodos);
  };

  // Calculate Progress
  const completedTasks = todos.filter((todo) => todo.completed).length;
  const totalTasks = todos.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="todo-container">
      <h1>To-Do List</h1>

      {/* Progress Tracker */}
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <p className="progress-text">
        {completedTasks} / {totalTasks} tasks completed
      </p>

      <div className="input-container">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Add a new task"
        />
        <DatePicker
          selected={dueDate}
          onChange={(date) => setDueDate(date)}
          placeholderText="Due Date"
          dateFormat="yyyy/MM/dd"
          minDate={new Date()} // Restrict past dates
        />
        <button onClick={handleAddTodo}>Add</button>
      </div>

      {/* Drag & Drop Context */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="todoList">
          {(provided) => (
            <ul ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                    >
                      <span
                        className={todo.completed ? "completed" : ""}
                        onClick={() => handleToggleComplete(todo.id)}
                      >
                        {todo.text}
                        {todo.dueDate && (
                          <span className="due-date">
                            ({todo.dueDate.toLocaleDateString()})
                          </span>
                        )}
                      </span>
                      <button onClick={() => handleDeleteTodo(todo.id)}>
                        Delete
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoList;
