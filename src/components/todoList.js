// todoList.js

import { createElement, addEvent, removeEvent } from "../core/dom.js";

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
    const togAll = document.getElementById('toggle-all');
    const self = this;
    const todos = this.getFilteredTodos();
    this.element.innerHTML = "";
    todos.forEach((todo) => {
      const todoItem = createElement("li", {
        className: todo.completed ? "completed checked" : "",
      }, todo.text);
      const toggle = createElement("input", {
        className: "checked",
        checked: todo.completed,
      });
      const destroy = createElement("span", {}, "x");
      addEvent(destroy, 'click', () => this.removeTodo(todo.id));

      addEvent(todoItem, "click", () => {
        self.toggleTodo(todo.id);
        if (!self.areAllCompleted()) {
          if (togAll.classList.contains('checked')) {
            togAll.classList.remove('checked');
          }
        }
        this.render();
      });
      todoItem.appendChild(toggle);
      todoItem.appendChild(destroy); // Obtenez l'élément bouton à partir du composant Button
      this.element.appendChild(todoItem);
    });

    // Gérer le clic sur le lien "Clear completed"
    addEvent(document.querySelector(".clear-completed"), "click", () => {
      this.clearCompleted();
      this.render();
    });
    // Gérer le clic sur le lien "toggle-all"
    // Fonction de rappel pour l'événement click
    function handleClick() {
      // Suppression de l'événement click
      removeEvent(togAll, "click", handleClick);
      if (todos.length === 0) {
        return false;
      }
      if(self.toggleAllComplete()){
        togAll.classList.add("checked");
      }else{
        if (togAll.classList.contains('checked')) {
          togAll.classList.remove('checked');
        }
      }
    }
    // Ajout de l'événement click
    addEvent(togAll, "click", handleClick);

    this.bindEvents();
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
    this.updateTaskCounter();
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
    this.updateTaskCounter();
  }

  removeTodo(id) {
    const { todos } = this.state.getState();
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    this.state.setState({ todos: updatedTodos });
    this.updateTaskCounter();
  }

  bindEvents() {
    const togAll = document.getElementById('toggle-all');
    const self = this;
    addEvent(document.querySelector(".new-todo"), "keypress", (event) => {
      if (event.key === "Enter") {
        if (event.target.value.trim() !== "") {
          this.addTodo(event.target.value.trim());
          this.render();
          event.target.value = "";
          if (togAll.classList.contains('checked')) {
            togAll.classList.remove('checked');
          }
        }
      }
    });

    addEvent(document.querySelector(".add-todo"), "click", () => {
      const inputBox = document.querySelector(".new-todo");
      if (inputBox.value.trim() !== "") {
        this.addTodo(inputBox.value.trim());
        this.render();
        inputBox.value = "";
        if (togAll.classList.contains('checked')) {
          togAll.classList.remove('checked');
        }
      }
    });
  }

  markAllCompleted() {
    const { todos } = this.state.getState();
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: true
    }));
    this.state.setState({ todos: updatedTodos });
    this.render();
  }

  markAllUncompleted() {
    const { todos } = this.state.getState();
    const updatedTodos = todos.map(todo => ({
      ...todo,
      completed: false
    }));
    this.state.setState({ todos: updatedTodos });
    this.render();
  }

  areAllCompleted() {
    const { todos } = this.state.getState();
    return todos.every(todo => todo.completed);
  }

  toggleAllComplete() {
    if (this.areAllCompleted()) {
      this.markAllUncompleted();
      this.updateTaskCounter();
      return false;
    } else {
      this.markAllCompleted();
      this.updateTaskCounter();
      return true;
    }
  }

  updateTaskCounter() {
    const { todos } = this.state.getState();
    const remainingTodos = todos.filter(todo => !todo.completed).length;
    const pluralSuffix = remainingTodos === 1 ? '' : 's';
    document.getElementById('task-counter').textContent = `${remainingTodos} task${pluralSuffix} remaining`;
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
