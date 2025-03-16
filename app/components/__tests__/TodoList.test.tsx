/// <reference types="@testing-library/jest-dom" />

import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoList from "../TodoList";

describe("TodoList", () => {
  beforeEach(() => {
    // ローカルストレージをクリアじゃない
    localStorage.clear();
    render(<TodoList />);
  });

  test("新しいタスクを追加できる", async () => {
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    const addButton = screen.getByText("追加");

    await userEvent.type(input, "新しいタスク");
    await userEvent.click(addButton);

    expect(screen.getByText("新しいタスク")).toBeInTheDocument();
  });

  test("空のタスクは追加できない", async () => {
    const addButton = screen.getByText("追加");
    await userEvent.click(addButton);

    const items = screen.queryAllByRole("listitem");
    expect(items).toHaveLength(0);
  });

  test("タスクを完了状態に切り替えられる", async () => {
    // タスクを追加
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    const addButton = screen.getByText("追加");
    await userEvent.type(input, "テストタスク");
    await userEvent.click(addButton);

    // タスクをクリック
    const taskItem = screen.getByText("テストタスク");
    await userEvent.click(taskItem);

    // チェックボックスが選択されていることを確認
    const checkbox = screen.getByRole("checkbox");
    expect(checkbox).toBeChecked();

    // テキストに取り消し線が付いていることを確認
    expect(taskItem).toHaveClass("line-through");
  });

  test("タスクを削除できる", async () => {
    // タスクを追加
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    const addButton = screen.getByText("追加");
    await userEvent.type(input, "削除するタスク");
    await userEvent.click(addButton);

    // 削除ボタンをクリック
    const deleteButton = screen.getByText("削除");
    await userEvent.click(deleteButton);

    // タスクが削除されたことを確認
    expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
  });

  test("エンターキーでタスクを追加できる", async () => {
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    await userEvent.type(input, "新しいタスク{enter}");
    expect(screen.getByText("新しいタスク")).toBeInTheDocument();
  });

  test("タスク削除後のフォーカス制御", async () => {
    // 2つのタスクを追加
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    await userEvent.type(input, "タスク1{enter}");
    await userEvent.type(input, "タスク2{enter}");

    // 最初のタスクを削除
    const deleteButtons = screen.getAllByText("削除");
    await userEvent.click(deleteButtons[0]);

    // 次のタスクにフォーカスが移っていることを確認
    const remainingTask = screen.getByRole("checkbox", { name: "タスク2" });
    expect(remainingTask).toHaveFocus();

    // 残りのタスクも削除
    await userEvent.click(deleteButtons[1]);

    // 入力欄にフォーカスが移っていることを確認
    expect(input).toHaveFocus();
  });

  test("Deleteキーでタスクを削除できる", async () => {
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    await userEvent.type(input, "削除するタスク{enter}");

    // チェックボックスコンテナを取得してフォーカス
    const checkboxContainer = screen.getByRole("checkbox", {
      name: "削除するタスク",
    });
    await userEvent.click(checkboxContainer); // フォーカスを確実に移動

    // Deleteキーを押して削除
    await userEvent.keyboard("{Delete}");

    // 要素が削除されたことを確認
    await expect(screen.queryByText("削除するタスク")).not.toBeInTheDocument();
    expect(input).toHaveFocus();
  });

  test("ローカルストレージにデータが保存される", async () => {
    const input = screen.getByPlaceholderText("新しいタスクを入力");
    await userEvent.type(input, "保存テスト{enter}");

    // ローカルストレージの内容を確認
    const savedData = JSON.parse(localStorage.getItem("todos") || "[]");
    expect(savedData).toHaveLength(1);
    expect(savedData[0].text).toBe("保存テスト");
  });

  test("ページ読み込み時にローカルストレージからデータを読み込む", () => {
    // テストデータをローカルストレージに設定
    const testData = [
      {
        id: 1,
        text: "テストタスク",
        completed: false,
      },
    ];
    localStorage.setItem("todos", JSON.stringify(testData));

    // コンポーネントを再レンダリング
    render(<TodoList />);

    // データが表示されていることを確認
    expect(screen.getByText("テストタスク")).toBeInTheDocument();
  });
});
