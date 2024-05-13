// form.js

import { createElement, addEvent } from '../core/dom.js';

class Form {
    constructor(onSubmit) {
        this.onSubmit = onSubmit;
        this.element = this.createForm();
    }

    // Méthode pour créer un formulaire
    createForm() {
        const form = createElement('form');
        addEvent(form, 'submit', this.handleSubmit.bind(this));
        return form;
    }

    // Méthode pour gérer la soumission du formulaire
    handleSubmit(event) {
        event.preventDefault();
        this.onSubmit(event.target);
    }

    // Méthode pour obtenir l'élément formulaire
    getElement() {
        return this.element;
    }
}

// Export de la classe Form
export default Form;
