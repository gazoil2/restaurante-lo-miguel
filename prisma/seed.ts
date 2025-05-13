import { PrismaClient } from '@prisma/client'
import { Dish } from '../generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // Create Address
  const address = await prisma.address.create({
    data: {
      province: 'Buenos Aires',
      city: 'CABA',
      street: 'Av. Siempreviva',
      number: 742,
      otherDetails: 'Departamento 3B',
    },
  })

  // Create User
  const user = await prisma.user.create({
    data: {
      name: 'Juan Perez',
      mail: 'juan@example.com',
      phoneNumber: '1122334455',
      password: 'hashed_password',
      addressId: address.id,
    },
  })

  // Table states
  const tableStateAvailable = await prisma.tableState.create({
    data: { state: 'Disponible' },
  })
  const table = await prisma.table.create({
    data: {
      tableStateId: tableStateAvailable.id,
    },
  })

  // Food Categories and Dishes
  const category = await prisma.foodCategory.create({
    data: {
      category: 'Parrilla',
      dishes: {
        create: [
          {
            name: 'Asado',
            desc: 'Corte de carne asada a la parrilla',
            price: 4000.0,
          },
          {
            name: 'Choripán',
            desc: 'Chorizo en pan con chimichurri',
            price: 1500.0,
          },
        ],
      },
    },
    include: { dishes: true },
  })

  // Order State
  const orderState = await prisma.orderState.create({
    data: { name: 'Pendiente' },
  })

  // Create Order with Details
  const order = await prisma.orderHeader.create({
    data: {
      userId: user.id,
      orderStateId: orderState.id,
      orderAddressId: address.id,
      total: 5500.0,
      discount: 0.0,
      orderDetails: {
        create: category.dishes.map((dish : Dish) => ({
          dishId: dish.id,
          amount: 1,
          total: dish.price,
          discount: 0,
        })),
      },
    },
  })

  console.log('🌱 Seed complete:', {
    user,
    address,
    table,
    dishes: category.dishes,
    order,
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
