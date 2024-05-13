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
    }

    // Méthode pour notifier tous les auditeurs lorsqu'il y a un changement d'état
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// Export de la classe State
export default State;
