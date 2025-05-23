import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { tableRouter } from "./routers/tableRouter";
import { dishRouter } from './routers/dishRouter';
import { orderRouter } from './routers/orderRouter';
import { userRouter } from './routers/userRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/menu', dishRouter)
app.use('/tables', tableRouter)
app.use('/orders', orderRouter)
app.use('/users',userRouter)
app.get('/', (req,res) => {
  try {
    res.json(
      {routes: [
        {method: "GET", route: "/menu"},
        {method: "GET", route: "/tables"},
        {method: "GET", route: "/orders"},
      ]})
  } catch (error) {
    console.log(error)
  }
})
app.get('/health', (req, res) => {
    try {
      res.json({ status: 'healthy' });
    } catch (error) {
      console.log(error)
    }
  });

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});