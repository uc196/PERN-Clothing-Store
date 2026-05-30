import express ,{ Request , Response } from 'express' ;
import cors from 'cors' ;
import "dotenv/config" ;

const app = express() ;

app.use(cors()) ;
app.use(express.json()) ;

const PORT = process.env.PORT || 5000 ;

app.get('/' , (req : Request , res : Response) => {
    res.json({ message : "Hello from the server!" }) ;
}) ;

app.listen(PORT , () => {
    console.log(`Server is running on port ${PORT}`) ;
}) ;