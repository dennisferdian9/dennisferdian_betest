import { Router, Request, Response } from "express";
import { accountLoginModel, userInfoSchemaModel } from "../model/users";
import { Document, Error } from 'mongoose';
import * as redis from 'redis';
import { redisClient } from "../config/redisClient";
import { producer } from "../config/kafka";
import authenticateJWT from "../middleware/auth";
import { hashPassword } from "../utils/hashPass";

export const Route = Router();


Route.post("/register", async (req: Request, res: Response) => {
  try {
    const dataToInput = {
      userId: new Date().getTime().toString(),
      fullName: "Dennis",
      accountNumber: new Date().getTime(),
      emailAddress: "test@email.com",
      registrationNumber: new Date().getTime(),
      accountId: new Date().getTime().toString(),
      password: hashPassword(new Date().getTime().toString()) ,
      lastLoginDateTime: new Date().getTime(),
    };

    await producer.connect();
    await producer.send({
      topic: 'kafka_dennisferdian_betest',
      messages: [
        { value: JSON.stringify(dataToInput) }
      ],
    });

    await producer.disconnect();

   

    const userInfoInsert = new userInfoSchemaModel({
      accountId: dataToInput.accountId,
      fullName: dataToInput.fullName,
      password: dataToInput.password,
      userId: dataToInput.userId,
    });
    await userInfoInsert.save()

    res.json({
      message: 'berhasil simpan user baru',
      result: {...dataToInput, password: 'rahasia'}
    })
    
  } catch (error) {
    res.status(500).json({
      status: 500,
      err: error
    });
  }
});

Route.get("/:userId",authenticateJWT, async (req: Request, res: Response) => {
  try {
  
    const { userId } = req.params;
    

    await redisClient.get(userId).then(async(data) => {
      if (!data) {
        const userData = await accountLoginModel.findOne({ userId: "1717595640832" });
        redisClient.set(userId, JSON.stringify(userData),{
          EX: 3600
        });
        res.json({
          data: userData,
        });
      } else {        
        res.json({
          data: JSON.parse(data),
        });
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      status: 500,
      error: 'Internal server error',
    });
  }
});


export default Route;
