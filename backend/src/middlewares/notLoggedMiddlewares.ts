import { Request, Response, NextFunction } from 'express';

const notLoggedMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session.userLogged) {
    next();
  } else {
    res.status(401).json('Usuário não autenticado');
  }
};

export default notLoggedMiddleware;
