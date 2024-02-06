import { Router } from 'express';
import passport from 'passport';

const sessionsRouter = Router();

// Ruta para iniciar sesión (puedes ajustar según tus necesidades)
sessionsRouter.post('/login', passport.authenticate('local', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

// Ruta para obtener el usuario actual
sessionsRouter.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ user: req.user });
});

export default sessionsRouter;
