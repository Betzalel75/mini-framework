// todoList.js

import { createElement, addEvent } from "../core/dom.js";
// import State from "../core/state.js";
import Button from "./button.js";

class TodoList {
  constructor(state, filter = "all") {
    this.filter = filter;
    this.state = state;
    this.element = this.createTodoList();
    this.bindEvents();
  }

  createTodoList() {
    let todoList = document.querySelector(".todo-list");
    if (!todoList) {
      todoList = createElement("ul", { className: "todo-list" });
      document.querySelector(".main").appendChild(todoList);
    }
    return todoList;
  }

  render() {
    if (!this.element) return;
    const todos = this.getFilteredTodos();
    this.element.innerHTML = "";
    todos.forEach((todo) => {
      const todoItem = createElement("li", {
        className: todo.completed ? "completed" : "",
      });
      const toggle = createElement("input", {
        type: "checkbox",
        className: "toggle",
        checked: todo.completed,
      });
      const label = createElement("label", {}, todo.text);
      const destroy = new Button("destroy", "X", () =>
        this.removeTodo(todo.id)
      );

      todoItem.addEventListener("click", () => {
        this.toggleTodo(todo.id);
        this.render();
      });
      todoItem.appendChild(toggle);
      todoItem.appendChild(label);
      todoItem.appendChild(destroy.getElement()); // Obtenez l'élément bouton à partir du composant Button
      this.element.appendChild(todoItem);
    });
  }

  getFilteredTodos() {
    const { todos } = this.state.getState();
    switch (this.filter) {
      case "active":
        return todos.filter((todo) => !todo.completed);
      case "completed":
        return todos.filter((todo) => todo.completed);
      default:
        return todos;
    }
  }

  addTodo(text) {
    const { todos } = this.state.getState();
    const newTodo = { id: Date.now(), text, completed: false };
    this.state.setState({ todos: [...todos, newTodo] });
  }

  toggleTodo(id) {
    const { todos } = this.state.getState();
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    // Mettre à jour l'état global avec les tâches modifiées
    this.state.setState({ todos: updatedTodos });
  }

  removeTodo(id) {
    const { todos } = this.state.getState();
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    this.state.setState({ todos: updatedTodos });
  }

  bindEvents() {
    addEvent(document.querySelector(".new-todo"), "keypress", (event) => {
      if (event.key === "Enter") {
        if (event.target.value.trim() !== "") {
          this.addTodo(event.target.value.trim());
          this.render();
          event.target.value = "";
        }
      }
    });
    // Gérer le clic sur le bouton "Mark all as complete"
    addEvent(document.querySelector(".toggle-all"), "click", () => {
      this.toggleAllComplete();
      this.render();
    });

    // Gérer le clic sur le lien "Clear completed"
    addEvent(document.querySelector(".clear-completed"), "click", () => {
      this.clearCompleted();
      this.render();
    });
  }

  toggleAllComplete() {
    const { todos } = this.state.getState();
    const areAllCompleted = todos.every((todo) => todo.completed);
    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: !areAllCompleted, // Inverser l'état de complétude de chaque tâche
    }));
    this.state.setState({ todos: updatedTodos });
  }

  clearCompleted() {
    const { todos } = this.state.getState();
    const updatedTodos = todos.filter((todo) => !todo.completed);
    this.state.setState({ todos: updatedTodos });
  }

  getElement() {
    return this.element || document.createElement("div");
  }
}

export default TodoList;
