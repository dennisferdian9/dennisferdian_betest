import { config } from 'dotenv'
import app from './index'


config() 
const PORT = process.env.PORT || 3000

const server = app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`)
})

