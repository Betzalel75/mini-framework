class Router {
  constructor(routes) {
    this.routes = routes;
    this.init();
  }

  init() {
    window.addEventListener("hashchange", this.route.bind(this));
    window.addEventListener("load", this.route.bind(this)); // pour gérer le premier chargement
    document.addEventListener("click", this.handleCustomLinkClick.bind(this));
    // this.route();
  }

  handleCustomLinkClick(event) {
    const target = event.target;
    if (target.tagName === "MY-LINK" || target.tagName === "CUSTOM-LINK") {
      const path = target.getAttribute("to");
      if (path) {
        event.preventDefault();
        this.push(path);
      }
    }
  }

  push(path) {
    window.location.hash = path;
  }

  route() {
    const path = window.location.hash.slice(1) || '/';
    const activeLink = document.querySelector(`my-link[to="/${path.slice(1)}"]`);
    activeLink.classList.add("selected");
    const matchedRoute = this.routes.find((route) => route.path === path);

    if (matchedRoute) {
      const main = document.querySelector('.main');
      const todoList = document.querySelector(".todo-list");
      if (main) {
        todoList.innerHTML = ''; // Efface le contenu du conteneur principal
        const component = new matchedRoute.component.constructor(matchedRoute.component.store, path.slice(1) || "all"); // Passer le filtre
        main.appendChild(component.element); // Rendre le nouveau composant
        component.render();
      }else{
        console.log('main not found');
      }
    }
  }
}

Router.install = function(app) {
  app.router = this;
};

export default Router;
