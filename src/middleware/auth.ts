import { config } from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
config()
const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication failed: Missing token' });
  }

  jwt.verify(token, process.env.SECRET_KEY ?? 'secret', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Authentication failed: Invalid token' });
    }
    
    req.user = decoded as { username: string };
    next();
  });
};

export default authenticateJWT;