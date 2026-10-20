import { port } from '../config/config.service.js'
import { connectDB, syncDB, connectRedis, userModel, WalletModel } from './DB/index.js'
import { globalErrorHandler } from './middleware/index.js'
import { authRouter, userRouter } from './modules/index.js'
import express from 'express'


async function bootstrap() {
    const app = express()
    //convert buffer data
    //db
    await connectDB();
    await syncDB();
    await connectRedis();
    app.use(express.json())
    //application routing
    app.get('/', (req, res) => res.send('Hello World!'))
    app.use('/auth', authRouter)
    app.use('/user', userRouter)
            
    //invalid routing
    app.use('{/*dummy}', (req, res) => {
        return res.status(404).json({ message: "Invalid application routing" })
    })

    //error-handling
    app.use(globalErrorHandler)
    
    app.listen(port, () => console.log(`E-Wallet app listening on port ${port}!`))
}
export default bootstrap