import { config } from "dotenv"

config()

const secret = process.env.secretHash ?? ''

export const hashPassword = (password: string) =>{
      const text = password + secret

      return text + text + text.charAt(2) + text + text.length
} 