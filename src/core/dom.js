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
        console.erro(container);
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