"use client";

import { useState, KeyboardEvent, useRef, useEffect } from "react";
import { Todo } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "todos";

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");
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

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

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
        <motion.button
          onClick={addTodo}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          追加
        </motion.button>
      </div>

      <div className="flex gap-2 mb-4">
        <motion.button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded ${
            filter === "all" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          すべて
        </motion.button>
        <motion.button
          onClick={() => setFilter("active")}
          className={`px-3 py-1 rounded ${
            filter === "active" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          未完了
        </motion.button>
        <motion.button
          onClick={() => setFilter("completed")}
          className={`px-3 py-1 rounded ${
            filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          完了済み
        </motion.button>
      </div>

      <ul className="space-y-2">
        <AnimatePresence>
          {filteredTodos.map((todo, index) => (
            <motion.li
              key={todo.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2 p-2 border rounded hover:bg-gray-50"
              layout
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
                <motion.input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2"
                  tabIndex={-1}
                  aria-hidden="true"
                  whileHover={{ scale: 1.2 }}
                />
                <motion.span
                  className={todo.completed ? "line-through" : ""}
                  animate={{
                    color: todo.completed ? "#9CA3AF" : "#000000",
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {todo.text}
                </motion.span>
              </div>
              <motion.button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTodo(todo.id, index);
                }}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                aria-label={`${todo.text}を削除`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                削除
              </motion.button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
