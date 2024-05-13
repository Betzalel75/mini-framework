// Définition de la classe correspondante à la balise personnalisée
class MyLink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      // Empêcher le comportement par défaut du lien
      event.preventDefault();
      // Rediriger vers l'URL spécifiée dans l'attribut 'to' de la balise
      document.querySelectorAll("my-link, custom-link").forEach((link) => {
        link.classList.remove("selected");
      });
      this.classList.add("clicked");
      this.classList.add("selected");
      window.location.href = this.getAttribute("to");
    });
  }
}

class CustomLink extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.addEventListener("click", (event) => {
      // Empêcher le comportement par défaut du lien
      event.preventDefault();
      // Rediriger vers l'URL spécifiée dans l'attribut 'to' de la balise
      document.querySelectorAll("my-link, custom-link").forEach((link) => {
        link.classList.remove("selected");
      });
      this.classList.add("clicked");
      this.classList.add("selected");
      window.location.href = this.getAttribute("to");
    });
  }
}

// Définition des balises personnalisées
customElements.define("my-link", MyLink);
customElements.define("custom-link", CustomLink);
