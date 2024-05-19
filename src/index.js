// index.js

import { createElement, addEvent, removeEvent, append } from "./core/dom.js";
import router from "./core/router.js";
import form from "./components/form.js";
import button from "./components/button.js";
import state from "./core/state.js";
import todoList from "./components/todoList.js";
import store from "./core/store.js";
import { reactive } from "./core/reactive.js";

class Setting {
    constructor() {
        this.plugins = [];
    }

    use(plugin) {
        if (typeof plugin.install === 'function') {
            plugin.install(this);
        } else if (typeof plugin === 'function') {
            plugin(this);
        }
        this.plugins.push(plugin);
    }
}


export default { createElement, addEvent, removeEvent, append, store, reactive, form, router, button, state, todoList, Setting };