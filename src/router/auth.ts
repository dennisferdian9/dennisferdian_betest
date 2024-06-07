import { Router, Request, Response } from "express";
export const Route = Router();
import express from 'express';
import jwt from 'jsonwebtoken';
import { userInfoSchemaModel } from "../model/users";
import { hashPassword } from "../utils/hashPass";

Route.post('/login', async (req, res) => {
      const { username, password } = req.body;
    
      // Find user by username and password      
      const user = await userInfoSchemaModel.findOne({ accountId: username, password: hashPassword(password) });
      
      if (!user) {
        await userInfoSchemaModel.findOneAndUpdate({accountId:username}, {
          lastLoginDateTime: new Date()
        })
        return res.status(401).json({ message: 'Invalid username or password' });
      }
    
      // Generate JWT token
      const token = jwt.sign({ username }, process.env.SECRET_KEY ?? 'secret', { expiresIn: '1h' });
    
      res.json({ token });
    });
    
    export default Route;