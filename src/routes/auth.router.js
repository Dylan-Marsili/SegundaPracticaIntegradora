// routes/auth.router.js
import { Router } from 'express';
import UserModel from '../models/User.js';
import bcrypt from 'bcrypt';

const authRouter = Router();

// Ruta para mostrar el formulario de login
authRouter.get('/login', (req, res) => {
  res.render('login');
});

// Ruta para procesar el login
authRouter.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });

  if (user && bcrypt.compareSync(password, user.password)) {
    req.session.user = { id: user._id, name: user.name, email: user.email, role: user.role };
    res.redirect('/products');
  } else {
    res.render('login', { error: 'Credenciales inválidas' });
  }
});

// Ruta para mostrar el formulario de registro
authRouter.get('/register', (req, res) => {
  res.render('register');
});

// Ruta para procesar el registro
authRouter.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new UserModel({ name, email, password: hashedPassword, role: 'usuario' });
  await newUser.save();

  res.redirect('/auth/login');
});

// Ruta para cerrar sesión
authRouter.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

export default authRouter;
