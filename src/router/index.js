// routes.js

import App from '../index.js'
import store from '../store/index.js';

// Routes de l'application TodoMVC
const routes = [
    { path: '/', component: new App.todoList(store) },
    { path: '/active', component: new App.todoList(store, 'active') },
    { path: '/completed', component: new App.todoList(store, 'completed') }
];

export default new App.router(routes);;