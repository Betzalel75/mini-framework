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
