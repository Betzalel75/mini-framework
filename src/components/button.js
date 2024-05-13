// button.js

import { createElement, addEvent } from '../core/dom.js';

class Button {
    constructor(classe,text, onClick) {
        this.text = text;
        this.onClick = onClick;
        this.classe = classe;
        this.element = this.createButton();
    }

    // Méthode pour créer un bouton
    createButton() {
        const button = createElement('button', { textContent: this.text, className: this.classe });
        button.style.cursor = 'pointer';
        addEvent(button, 'click', this.onClick);
        return button;
    }

    // Méthode pour obtenir l'élément bouton
    getElement() {
        return this.element;
    }
}

// Export de la classe Button
export default Button;
