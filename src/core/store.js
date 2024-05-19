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