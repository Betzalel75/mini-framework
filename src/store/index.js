import Store from "../core/store.js";
import { reactive } from "../core/reactive.js";

const storeOptions = {
    state: reactive({
        todos: []
    }),
    mutations: {
        addTodo(state, todo) {
            if (!state.todos || state.todos.length === 0) {
                state.todos = []
            }
            state.todos.unshift(todo);
        },
        toggleTodo(state, id) {
            const todo = state.todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        removeTodo(state, id) {
            state.todos = state.todos.filter(todo => todo.id !== id);
        },
        clearCompleted(state) {
            state.todos = state.todos.filter(todo => !todo.completed);
        },
        markAllCompleted(state) {
            state.todos.forEach(todo => todo.completed = true);
        },
        markAllUncompleted(state) {
            state.todos.forEach(todo => todo.completed = false);
        },
        updateTodo(state, { id, text }) {
            const todo = state.todos.find(todo => todo.id === id);
            if (todo) {
                todo.text = text;
            }
        },
    },
    getters: {
        completed(state) {
            return state.todos.filter(todo => todo.completed);
        },
        active(state) {
            return state.todos.filter(todo => !todo.completed);
        },
        all(state) {
            return state.todos;
        }
    },
};

const store = new Store(storeOptions);

export default store;