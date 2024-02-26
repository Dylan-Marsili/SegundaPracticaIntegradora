import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import exphbs from 'express-handlebars';
import path from 'path';
import bodyParser from 'body-parser';
import passport from './passportConfig.js';
import bcrypt from 'bcrypt';

import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import authRouter from './routes/auth.router.js';

const app = express();
const PORT = 8080;

// Conectar a MongoDB
mongoose.connect('mongodb+srv://coder:jIZk1nSKACa6yEmA@codehouse.5nhulxs.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
db.once('open', () => {
  console.log('Conectado a MongoDB');
});

// Configuración de Handlebars
app.engine('.hbs', exphbs({ extname: '.hbs', defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views/layouts') }));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// Middleware para manejar solicitudes con cuerpo en formato JSON
app.use(express.json());

// Middleware para manejar sesiones
app.use(session({
  secret: 'my-secret-key', // Cambia esto a una clave segura
  resave: false,
  saveUninitialized: true,
}));

// Middleware para parsear el cuerpo de las solicitudes
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

// Rutas de la aplicación
app.use('/api/products', productsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/carts', cartsRouter);
app.use('/auth', authRouter);
app.use('/', viewsRouter);

// Ruta para la página principal con Handlebars
app.get('/', (req, res) => {
  const user = req.session.user;
  res.render('home', { title: 'Mi Aplicación', user });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
