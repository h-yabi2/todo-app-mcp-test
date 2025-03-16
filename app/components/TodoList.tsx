"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Todo } from "@/types";

const STORAGE_KEY = "todos";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const todoRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 初回マウント時にローカルストレージからデータを読み込む
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // todosが更新されたらローカルストレージに保存
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const setTodoRef = (index: number) => (element: HTMLDivElement | null) => {
    todoRefs.current[index] = element;
  };

  const addTodo = () => {
    if (newTodo.trim() === "") return;

    const todo: Todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
    };

    setTodos([...todos, todo]);
    setNewTodo("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number, index: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));

    // 削除後のフォーカス制御
    setTimeout(() => {
      const nextTodo = todoRefs.current[index];
      if (nextTodo) {
        nextTodo.focus();
      } else {
        inputRef.current?.focus();
      }
    }, 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const handleItemKeyDown = (
    e: KeyboardEvent<HTMLDivElement>,
    id: number,
    index: number
  ) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTodo(id);
    } else if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      deleteTodo(id, index);
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input
          ref={inputRef}
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-2 border rounded"
          placeholder="新しいタスクを入力"
        />
        <button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          追加
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo, index) => (
          <li
            key={todo.id}
            className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
          >
            <div
              ref={setTodoRef(index)}
              role="checkbox"
              tabIndex={0}
              aria-checked={todo.completed}
              className="flex items-center flex-1 cursor-pointer"
              onClick={() => toggleTodo(todo.id)}
              onKeyDown={(e) => handleItemKeyDown(e, todo.id, index)}
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="mr-2"
                tabIndex={-1}
                aria-hidden="true"
              />
              <span className={todo.completed ? "line-through" : ""}>
                {todo.text}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteTodo(todo.id, index);
              }}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              aria-label={`${todo.text}を削除`}
            >
              削除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
