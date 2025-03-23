"use client";

import { motion } from "framer-motion";
import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <motion.main
      className="w-full max-w-2xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-lg"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full"
      >
        <motion.h1
          className="text-3xl font-bold mb-6 text-center text-gray-800"
          whileHover={{ scale: 1.03 }}
        >
          ToDoリスト
        </motion.h1>
        <TodoList />
      </motion.div>
    </motion.main>
  );
}
