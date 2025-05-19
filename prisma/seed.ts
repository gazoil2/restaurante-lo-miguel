import { Dish, PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // Create Address
  const address = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      province: 'alice@prisma.io',
      city: 'Alice',
      street: 'Torcuato',
      number: 21,
      otherDetails: 'Departamento 5B'
    },
  })

  // Create User
  const user = await prisma.user.upsert({
    where: { id : 1 },
    update: {},
    create: {
      name: 'Juan Perez',
      mail: 'juan@example.com',
      phoneNumber: '1122334455',
      password: '123456',
      addressId: address.id,
    },
  })

  const user2 = await prisma.user.upsert({
    where: { id : 2 },
    update: {},
    create: {
      name: 'Admin',
      mail: 'Admin@Admin.com',
      phoneNumber: 'Admin',
      password: 'Admin',
      addressId: address.id,
    },
  })

  const admin = await prisma.admin.upsert({
    where: {id: 1},
    update: {},
    create: {
      id:2,
      idUser: user2.id
    },
  })

  const foodCategory = await prisma.foodCategory.upsert({
    where: {id : 1},
    update: {},
    create: {
      category: "Entrada"
    }
  })

  const dishState = await prisma.dishState.upsert({
    where: {id : 1},
    update: {},
    create: {
      id: 1,
      name: "Stockeado"
    }
  })

  const preparada = await prisma.orderState.upsert({
    where: {id : 1},
    update: {},
    create: {
      state: "Preparado"
    }

  })

  const enPreparacion = await prisma.orderState.upsert({
    where: {id : 2},
    update: {},
    create: {
      state: "En preparación"
    }

  })
  
  const tableState = await prisma.tableState.upsert({
    where: {id : 1},
    update: {},
    create: {
      state: "Libre",
    }
  })
  
  const dish = await prisma.dish.upsert({
    where: {id : 1},
    update: {},
    create: {
      name : "Rabas",
      desc : "Pescado",
      price : 200.00,
      categoryId: foodCategory.id,
      dishStateId: dishState.id,
    }
  })

  const tables = await Promise.all(
    Array.from({ length: 15 }).map(() =>
      prisma.table.create({
        data: {
          tableStateId: tableState.id,
          size: 4,
        },
      })
    )
  )
  

  const orderHeader = await prisma.orderHeader.upsert({
    where: {id : 1},
    update: {},
    create: {
      userId: user.id,
      orderStateId: enPreparacion.id,
      orderAddressId: address.id,
      total: 400.00,
      discount: 0,
    }

  })

  const orderDetail = await prisma.orderDetail.upsert({
    where: {id : 1},
    update: {},
    create: {
      orderHeaderId: orderHeader.id,
      dishId: dish.id,
      amount: 2,
      total: 400.00,
      discount: 0.0,
    }
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
