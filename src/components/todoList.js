// todoList.js

import { createElement, addEvent } from "../core/dom.js";

// Définir une variable pour garder une trace de l'état du debounce
let isDebounced = false;

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
      });

      const p = createElement('p', {}, todo.text);

      const destroy = createElement("span", {}, "x");
      addEvent(destroy, 'click', (e) => {
        e.stopPropagation();
        self.removeTodo(todo.id);
        this.render();
      });
      /**/
      addEvent(p, "click", (e) => {
        e.stopPropagation();
        self.toggleTodo(todo.id);
        if (!self.areAllCompleted()) {
          if (togAll.classList.contains('checked')) {
            togAll.classList.remove('checked');
          }
        }
        this.render();
      });
      todoItem.appendChild(p);
      /**/
      addEvent(todoItem, "dblclick", (e) => {
        e.stopPropagation();
        self.editTodo(e.target.querySelector('p').textContent);
        self.removeTodo(todo.id);
        this.render();
      })
      todoItem.appendChild(destroy);
      this.element.appendChild(todoItem);
    });

    // Gérer le clic sur le lien "Clear completed"
    addEvent(document.querySelector(".clear-completed"), "click", () => {
      this.clearCompleted();
      this.render();
    });
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
    // Gérer l'événement click sur le bouton "toggle-all"
    function handleClick() {
      if (!isDebounced) {
        isDebounced = true;
        if (self.toggleAllComplete()) {
          togAll.classList.add("checked");
        } else {
          if (togAll.classList.contains('checked')) {
            togAll.classList.remove('checked');
          }
        }
        setTimeout(() => {
          isDebounced = false;
        }, 300);
      }
    }

    // Ajouter l'événement click avec la fonction de débordement
    addEvent(togAll, "click", handleClick);

  };

  editTodo(text) {
    document.querySelector(".new-todo").value = text;
  };

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
