import TodoList from "./components/TodoList";

export default function Home() {
  return (
    <main className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ToDoリスト</h1>
      <TodoList />
    </main>
  );
}
