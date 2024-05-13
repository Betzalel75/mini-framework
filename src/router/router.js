// router.js

class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  // Méthode pour initialiser le système de routage
  init() {
    window.addEventListener("hashchange", this.route.bind(this));
    this.route();
  }
  // Méthode pour gérer les clics sur les balises personnalisées
  handleCustomLinkClick(event) {
    const target = event.target;
    if (target.tagName === "MY-LINK" || target.tagName === "CUSTOM-LINK") {
      const path = target.getAttribute("to");
      if (path) {
        event.preventDefault();
        window.location.hash = path; 
      }
    }
  }
  // Méthode pour gérer le changement d'URL
  route() {
    const path = window.location.hash.slice(1);
    const matchedRoute = this.routes.find((route) => route.path === path);

    if (matchedRoute) {
      matchedRoute.component.render();
    }
  }
}

// Export de la classe Router
export default Router;
