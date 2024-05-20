import { createElement, addEvent, append } from "../core/dom.js";

let isDebounced = false;

class TodoList {
  constructor(store, filter = "all") {
    this.filter = filter;
    this.store = store;
    this.element = this.createTodoList();
    this.render();
  }

  createTodoList() {
    let todoList = document.querySelector(".todo-list");
    if (!todoList) {
      todoList = createElement("ul", { className: "todo-list" });
      append(todoList, document.querySelector(".main"));
    }
    return todoList;
  }

  render() {
    if (!this.element) return;
    const togAll = document.getElementById('toggle-all');
    const todos = this.getFilteredTodos(this.filter);
    this.element.innerHTML = "";
    todos.forEach((todo) => {
      const todoItem = createElement("li", {
        className: todo.completed ? "completed checked" : "",
      });

      const p = createElement('p', {}, todo.text);

      const destroy = createElement("span", {}, "x");
      addEvent(destroy, 'click', (e) => {
        e.stopPropagation();
        this.store.commit('removeTodo', todo.id);
        this.render();
      });

      let clickTimer = null;
      const clickDelay = 150; // Délai en millisecondes pour différencier clic simple et double-clic
  
      const handleClick = (e) => {
        e.stopPropagation();
        if (clickTimer) {
          clearTimeout(clickTimer);
          clickTimer = null;
          this.editTodoText(todoItem, todo.id);
        } else {
          clickTimer = setTimeout(() => {
            this.store.commit('toggleTodo', todo.id);
            if (!this.areAllCompleted()) {
              if (togAll.classList.contains('checked')) {
                togAll.classList.remove('checked');
              }
            }
            this.updateTaskCounter();
            this.render();
            clickTimer = null;
          }, clickDelay);
        }
      };

      addEvent(p, "click", handleClick);
      append(p, todoItem);

      addEvent(todoItem, "click", handleClick);
      append(destroy, todoItem);
      append(todoItem, this.element);
    });

    addEvent(document.querySelector(".clear-completed"), "click", () => {
      this.store.commit('clearCompleted');
      this.render();
    });
    this.bindEvents();
  }

  getFilteredTodos(filter) {
    const todos = this.store;
    switch (filter) {
      case "active":
        return todos.getters.active;
      case "completed":
        return todos.getters.completed;
      default:
        return todos.getters.all;
    }
  }

  addTodo(text) {
    this.store.commit('addTodo', { id: Date.now(), text, completed: false });
    this.updateTaskCounter();
  }

  addTodoWithFilter(text) {
    const path = window.location.hash.slice(1) || '/';
    this.addTodo(text);
    this.filter = path.slice(1);
    this.render();
  }

  editTodoText(todoItem, idItem) {
    const textElement = todoItem.querySelector('p');
    const currentText = textElement.textContent;

    // Créer l'élément d'input pour l'édition
    const input = createElement('input', { type: 'text', value: currentText, class: 'edit' });

    // Remplacer le texte par l'input
    todoItem.replaceChild(input, textElement)

    input.focus();

    const saveEdit = () => {
      const newText = input.value.trim();
      if (newText && newText !== currentText) {
        this.store.commit('updateTodo', { id: idItem, text: newText });
      }

      // Créer un nouvel élément de liste pour remplacer l'ancien
      const updatedTodoItem = createElement("li", {
        class: todoItem.completed ? "completed checked" : "",
        "data-id": idItem
      });

      const updatedTextElement = createElement('p', {}, newText || currentText);
      const destroy = createElement("span", {}, "x");

      addEvent(destroy, 'click', (e) => {
        e.stopPropagation();
        this.store.commit('removeTodo', idItem);
        this.render();
      });

      addEvent(updatedTextElement, "click", (e) => {
        e.stopPropagation();
        this.store.commit('toggleTodo', idItem);
        if (!this.areAllCompleted()) {
          if (document.getElementById('toggle-all').classList.contains('checked')) {
            document.getElementById('toggle-all').classList.remove('checked');
          }
        }
        this.updateTaskCounter();
        this.render();
      });

      addEvent(updatedTodoItem, "dblclick", (e) => {
        e.stopPropagation();
        this.editTodoText(updatedTodoItem);
      });

      append(updatedTextElement, updatedTodoItem);
      append(destroy, updatedTodoItem);
      this.render();
    };

    addEvent(input, 'blur', saveEdit);
    addEvent(input, 'keypress', (e) => {
      if (e.key === 'Enter') {
        saveEdit();
      }
    });
  }


  bindEvents() {
    const togAll = document.getElementById('toggle-all');
    const self = this;
    addEvent(document.querySelector(".new-todo"), "keypress", (event) => {
      if (event.key === "Enter") {
        if (event.target.value.trim() !== "") {
          this.addTodoWithFilter(event.target.value.trim());
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
        this.addTodoWithFilter(inputBox.value.trim());
        inputBox.value = "";
        if (togAll.classList.contains('checked')) {
          togAll.classList.remove('checked');
        }
      }
    });

    function handleClick(e) {
      e.preventDefault();
      e.stopPropagation();
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
    if (this.store.getters.all <= 0) {
      togAll.classList.add("editing");
    }else{
      togAll.classList.remove("editing");
    }
    addEvent(togAll, "click", handleClick);
  }

  markAllCompleted() {
    this.store.commit('markAllCompleted');
    this.render();
  }

  markAllUncompleted() {
    this.store.commit('markAllUncompleted');
    this.render();
  }

  areAllCompleted() {
    return this.store.state.todos.every(todo => todo.completed);
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
    const remainingTodos = this.store.getters.all.filter(todo => !todo.completed).length;
    const pluralSuffix = remainingTodos === 1 ? '' : 's';
    document.getElementById('task-counter').textContent = `${remainingTodos} task${pluralSuffix} remaining`;
  }
}

export default TodoList;
