import express from 'express'
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { tableRouter } from "./routers/tableRouter";
import { dishRouter } from './routers/dishRouter';
import { orderRouter } from './routers/orderRouter';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());


const swaggerOptions = {
    definition: {
      openapi: '3.0.0', 
      info: {
        title: 'API del Restaurante Lo Miguel',
        version: '2.0.0',
        description: 'Una API para gestionar mesas, pedidos y usuarios en el restaurante.',
      },
    },
    apis: ['./api/routers/*.ts'], 
  };

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use('/menu', dishRouter)
app.use('/tables', tableRouter)
app.use('/orders', orderRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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