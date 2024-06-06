import { Kafka, Producer, Consumer } from 'kafkajs';
import { accountLoginModel, userInfoSchemaModel } from '../model/users';
import mongoose from 'mongoose';
import { config } from 'dotenv';

config()

const kafka = new Kafka({
      clientId: 'kafka_dennisferdian_betest_my-app',
      brokers: [process.env.KAFKA_BROKER ?? 'localhost:9092'],
});
    
export const producer: Producer = kafka.producer();
export const consumer: Consumer = kafka.consumer({ groupId: 'kafka_dennisferdian_betest_my-app' });

const produceUserInfo = async () => {
      await producer.connect();
    
      try {
        const users = await userInfoSchemaModel.find(); // Fetch all users from MongoDB
    
        for (const user of users) {
          const message = JSON.stringify({
            userId: user.userId,
            fullName: user.fullName,
            accountId: user.accountId,
          });
    
          await producer.send({
            topic: 'kafka_dennisferdian_betest',
            messages: [{ value: message }],
          });
    
        }
      } catch (error) {
        console.error('Error producing messages to Kafka', error);
      } finally {
        await producer.disconnect();
      }
    };
    
produceUserInfo().catch(console.error);

const consumeMessages = async () => {
      await consumer.connect();
      await consumer.subscribe({ topic: 'kafka_dennisferdian_betest', fromBeginning: true });
    
      await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                  try {
                              const rawMessage = message?.value?.toString() ?? '';
                        const dataToInput = JSON.parse(rawMessage);                        
      

                        const loginInsert = new accountLoginModel({
                              userId: dataToInput.userId,
                              fullName: dataToInput.fullName,
                              accountNumber: dataToInput.accountNumber,
                              emailAddress: dataToInput.emailAddress,
                              registrationNumber: dataToInput.registrationNumber,
                        });
                        
                        await loginInsert.save()
                  } catch (error) {
                        console.error('Error processing message:', error);                        
                  }
                  },
});
};

consumeMessages().catch(err => console.log(err));
