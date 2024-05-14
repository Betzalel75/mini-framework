// app.js

import App from '../src/index.js'

// État global pour les tâches
const state = new App.state({ todos: [] });
// Routes de l'application TodoMVC
const routes = [
    { path: '/', component: new App.todoList(state) },
    { path: '/active', component: new App.todoList(state, 'active') },
    { path: '/completed', component: new App.todoList(state, 'completed') }
];

// Initialisation du routeur
export default new App.router(routes);