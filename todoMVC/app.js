// app.js

import App from '../src/index.js'
import store from '../src/store/index.js';
import router from '../src/router/index.js';

// Instance de l'application
const app = new App.Setting();

// // Utiliser le store dans l'application
app.use(store);
app.use(router);

export default app;
