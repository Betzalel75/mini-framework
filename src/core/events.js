// events.js

class EventManager {
    constructor() {
        this.events = {};
    }

    // Méthode pour ajouter un écouteur d'événement
    addEventListener(eventType, listener) {
        if (!this.events[eventType]) {
            this.events[eventType] = [];
        }
        this.events[eventType].push(listener);
    }

    // Méthode pour supprimer un écouteur d'événement
    removeEventListener(eventType, listener) {
        if (this.events[eventType]) {
            this.events[eventType] = this.events[eventType].filter(fn => fn !== listener);
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
