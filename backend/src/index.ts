import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const SERVER_PORT = 5180;


app.use(cors());
app.use(express.json());


app.get('/', (req: Request, res: Response) => {
    console.log('Hello, TypeScript with Express :)))!');
    res.send('Hello, TypeScript with Express :)))!');
});


app.listen(SERVER_PORT, () => {
  console.log(`Server running on port http://localhost:${SERVER_PORT}`);
});