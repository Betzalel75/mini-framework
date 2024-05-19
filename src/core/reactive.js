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
