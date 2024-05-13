// app.js

import TodoList from '../src/components/todoList.js';
import Router from '../src/router/router.js';
import State from '../src/core/state.js';

// État global pour les tâches
const state = new State({ todos: [] });
// Routes de l'application TodoMVC
const routes = [
    { path: '/', component: new TodoList(state) },
    { path: '/active', component: new TodoList(state, 'active') },
    { path: '/completed', component: new TodoList(state, 'completed') }
];

// Initialisation du routeur
export default new Router(routes);