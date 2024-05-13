// dom.js

// Fonction pour créer un élément HTML avec des attributs
function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        element[key] = value;
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

    return element;
}


// Fonction pour ajouter un événement à un élément HTML
function addEvent(element, eventType, eventHandler) {
    element.addEventListener(eventType, eventHandler);
}

// Fonction pour supprimer un evenement a un element HTML
function removeEvent(element, eventType, eventHandler) {
    element.removeEventListener(eventType, eventHandler);
}
// Exports des fonctions
export { createElement, addEvent, removeEvent };
