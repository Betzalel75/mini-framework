
---

# Documentation du Mini-Framework Quick Js

## Introduction

Ce mini-framework `Quick Js` permet de créer un projet frontend pour des petits projet de developpement en `JavaScript`.
Pour illustrer cela nous avons créer une `todo-list`. Nous avons créé, affiché et géré des tâches en utilisant un système de routage basé sur les URL. Les tâches peuvent être filtrées selon leur statut : `all`, `active` ou `completed`.

## Installation

1. Téléchargez les fichiers du framework.
```bash
    git clone https://github.com/Betzalel75/mini-framework.git
```
2. Ajoutez les fichiers JavaScript à votre projet.
3. Incluez les fichiers dans votre fichier HTML principal.

### Exemple de fichier HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TodoMVC App</title>
    <link rel="stylesheet" href="styles.css">
    <script src="custom-elements.js"></script>
</head>
<body>
    <header class="header">
        <h1>todos</h1>
        <input class="new-todo" placeholder="What needs to be done?" autofocus>
    </header>
    <section class="main">
        <input id="toggle-all" class="toggle-all" type="checkbox">
        <label for="toggle-all">Mark all as complete</label>
        <ul class="todo-list"></ul>
    </section>
    <footer class="footer">
        <span class="todo-count" id="task-counter"></span>
        <ul class="filters">
            <li><a href="#/" class="selected">All</a></li>
            <li><a href="#/active">Active</a></li>
            <li><a href="#/completed">Completed</a></li>
        </ul>
        <button class="clear-completed">Clear completed</button>
    </footer>
    <script type="module" src="app.js"></script>
</body>
</html>
```

## Utilisation

### Initialisation

Créez un fichier `app.js` et initialisez votre application :

```javascript
// app.js
import App from 'mini-framework/src/index.js'
import store from 'mini-framework/src/store/index.js';
import router from 'mini-framework/src/router/index.js';

// Instance de l'application
const app = new App.Setting();

// // Utiliser le store dans l'application
app.use(store);
app.use(router);

export default app;
```

### État

La classe `State` permet de gérer l'état global de l'application :

```javascript
// state.js

class State {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.listeners = [];
    }

    // Getter pour récupérer l'état actuel
    getState() {
        return { ...this.state };
    }

    // Setter pour mettre à jour l'état avec de nouvelles valeurs
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notifyListeners();
    }

    // Méthode pour s'abonner aux changements d'état
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter((l) => l !== listener);
        };
    }
    // Méthode pour réinitialiser l'état à une valeur initiale vide
    resetState() {
        this.state = {};
        this.notifyListeners();
    }

    // Méthode pour notifier tous les auditeurs lorsqu'il y a un changement d'état
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Export de la classe State
export default State;

```

### Gestionnaire d'événements

La classe `EventManager` permet de gérer les événements de manière centralisée :

```javascript
// events.js

class EventManager {
    constructor(element) {
        this.element = element;
        this.events = {};
    }

    // Méthode pour ajouter un écouteur d'événement
    addEventListener(eventType, listener) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
            // Attacher l'écouteur d'événement DOM
            this.element.addEventListener(eventType, (event) => {
                this.dispatchEvent(eventType, event);
            });
        }
        this.events[eventType].push(listener);
    }

    // Méthode pour supprimer un écouteur d'événement
    removeEventListener(eventType, listener) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(fn => fn !== listener);
            if (this.events[eventType].length === 0) {
                delete this.events[eventType];
                // Retirer l'écouteur d'événement DOM
                this.element.removeEventListener(eventType, (event) => {
                    this.dispatchEvent(eventType, event);
                });
            }
        }
    }

    // Méthode pour déclencher un événement
    dispatchEvent(eventType, data) {
        if (this.events[eventType]) {
            this.events[eventType].forEach(listener => listener(data));
        }
    }
}

// Export de la classe EventManager
export default EventManager;

```

### Store

La classe Store permet de gérer l'état global de l'application et de créer des mutations, actions et getters.

```javascript
class Store {
    constructor(options) {
        this.state = new Proxy(options.state || {}, {
            set: (target, key, value) => {
                target[key] = value;
                this.events.emit(key, value);
                return true;
            }
        });
        this.mutations = options.mutations || {};
        this.actions = options.actions || {};
        this.getters = {};
        this.events = {
            events: {},
            on(event, listener) {
                if (!this.events[event]) {
                    this.events[event] = [];
                }
                this.events[event].push(listener);
            },
            emit(event, ...args) {
                if (this.events[event]) {
                    this.events[event].forEach(listener => listener(...args));
                }
            }
        };

        // Set up getters
        if (options.getters) {
            for (const [key, getter] of Object.entries(options.getters)) {
                Object.defineProperty(this.getters, key, {
                    get: () => getter(this.state),
                    enumerable: true
                });
            }
        }
    }

    commit(mutation, payload) {
        if (this.mutations[mutation]) {
            this.mutations[mutation](this.state, payload);
        } else {
            console.error(`Mutation ${mutation} doesn't exist`);
        }
    }

    dispatch(action, payload) {
        if (this.actions[action]) {
            return this.actions[action]({
                state: this.state,
                commit: this.commit.bind(this)
            }, payload);
        } else {
            console.error(`Action ${action} doesn't exist`);
        }
    }
}

// Ajouter une méthode d'installation au store
Store.install = function(app) {
    app.store = this;
};


export default Store;
```

### Routage

La classe `Router` permet de gérer le routage de l'application :

```javascript
class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener("hashchange", this.route.bind(this));
    window.addEventListener("load", this.route.bind(this)); // pour gérer le premier chargement
    document.addEventListener("click", this.handleCustomLinkClick.bind(this));
    // this.route();
  }

  handleCustomLinkClick(event) {
    const target = event.target;
    if (target.tagName === "MY-LINK" || target.tagName === "CUSTOM-LINK") {
      const path = target.getAttribute("to");
      if (path) {
        event.preventDefault();
        this.push(path);
      }
    }
  }

  push(path) {
    window.location.hash = path;
  }

  route() {
    const path = window.location.hash.slice(1) || '/';
    const activeLink = document.querySelector(`my-link[to="/${path.slice(1)}"]`);
    activeLink.classList.add("selected");
    const matchedRoute = this.routes.find((route) => route.path === path);

    if (matchedRoute) {
      const main = document.querySelector('.main');
      const todoList = document.querySelector(".todo-list");
      if (main) {
        todoList.innerHTML = ''; // Efface le contenu du conteneur principal
        const component = new matchedRoute.component.constructor(matchedRoute.component.store, path.slice(1) || "all"); // Passer le filtre
        main.appendChild(component.element); // Rendre le nouveau composant
        component.render();
      }else{
        console.error('main not found');
      }
    }
  }
}

Router.install = function(app) {
  app.router = this;
};

export default Router;

```

### Gestion du DOM

Les fonctions utilitaires pour la manipulation du DOM :

```javascript
// dom.js
import EventManager from "./events.js";

// Fonction pour créer un élément HTML avec des attributs
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'class') {
            element.className = value;
        } else if (key === 'id') {
            element.id = value;
        } else {
            element[key] = value;
        }
    });

    // Vérifiez si children est un tableau, sinon convertissez-le en tableau
    const childrenArray = Array.isArray(children) ? children : [children];
    
    // Parcourez chaque enfant et ajoutez-le à l'élément
    childrenArray.forEach(child => {
        if (typeof child === 'string') {
            element.appendChild(document.createTextNode(child)); // Si l'enfant est une chaîne de caractères, créez un nœud de texte
        } else if (child instanceof HTMLElement) {
            element.appendChild(child); // Si l'enfant est un élément HTML, ajoutez-le tel quel
        }
    });

    // Retourner l'élément créé    
    return element;
}

function append(element, container) {
    if (container instanceof Node) {
        container.appendChild(element);
      } else {
        console.error(container);
      throw new Error("Container is not a valid DOM node");
    }
  }

// Fonction pour ajouter un événement à un élément HTML
function addEvent(element, eventType, eventHandler) {
    const event = new EventManager(element);
    event.addEventListener(eventType, eventHandler);
}

// Fonction pour supprimer un événement d'un élément HTML
function removeEvent(element, eventType, eventHandler) {
    const event = new EventManager(element);
    event.removeEventListener(eventType, eventHandler);
}

// Exports des fonctions
export { createElement, append ,addEvent, removeEvent };
```

## Proxy Réactif

Le proxy réactif permet de détecter les changements de propriétés et d'émettre des événements :

```javascript
class ReactiveHandler {
    constructor(target, events) {
        this.target = target;
        this.events = events;
    }

    get(target, prop) {
        // Permettre l'accès à la propriété
        return target[prop];
    }

    set(target, prop, value) {
        // Détecter les changements de propriétés
        target[prop] = value;
        this.events.emit(prop, value);
        return true;
    }
}

export function reactive(obj) {
    const events = {
        events: {},
        on(event, listener) {
            if (!this.events[event]) {
                this.events[event] = [];
            }
            this.events[event].push(listener);
        },
        emit(event, ...args) {
            if (this.events[event]) {
                this.events[event].forEach(listener => listener(...args));
            }
        }
    };

    const proxy = new Proxy(obj, new ReactiveHandler(obj, events));
    proxy.events = events;
    return proxy;
}

```


## Exemples d'utilisation

### Création d'un router
Créez un fichier `routes.js` dans lequel vous placerez vos différentes routes.

```javascript
// routes.js
import App from '../index.js'
import store from '../store/index.js';

// Routes de l'application TodoMVC
const routes = [
    { path: '/', component: new App.todoList(store) },
    { path: '/active', component: new App.todoList(store, 'active') },
    { path: '/completed', component: new App.todoList(store, 'completed') }
];

export default new App.router(routes);
```

### Création d'un store

Créez un fichier `index.js` dans un répertoire `store` dans lequel vous créerez votre store :

```javascript
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
```

Ajouter une tâche

```javascript

const inputBox = document.querySelector(".new-todo");
if (inputBox.value.trim() !== "") {
    todoList.addTodo(inputBox.value.trim());
    todoList.render();
    inputBox.value = "";
}
```
### Filtrer les tâches

```javascript
    getFilteredTodos(filter) {
    const todos = this.store;
    switch (filter) {
      case "active":
        return todos.getters.active; // Pour afficher uniquement les tâches actives
      case "completed":
        return todos.getters.completed; // Pour afficher uniquement les tâches complétées 
      default:
        return todos.getters.all;
    }
  }
```

### Marquer toutes les tâches comme complétées

```javascript
markAllCompleted() {
    this.store.commit('markAllCompleted');
    this.render();
  }
```

### Supprimer toutes les tâches complétées

```javascript
addEvent(document.querySelector(".clear-completed"), "click", () => {
      this.store.commit('clearCompleted');
      this.render();
    });
```
## LICENSE

[![License](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](LICENSE)

## Auteurs
- 👤 **Betzalel75**: [Profile](https://github.com/Betzalel75)
---
