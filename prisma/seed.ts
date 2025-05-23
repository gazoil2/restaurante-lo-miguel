import { PrismaClient } from '../generated/prisma'
const prisma = new PrismaClient()

async function main() {
  // Create Address
  const direccionTorcuato = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      province: 'Buenos Aires',
      city: 'Avellaneda',
      street: 'Sarmiento',
      number: 97,
      otherDetails: 'Departamento 12 D'
    },
  })

  // Create User
  const juan = await prisma.user.upsert({
    where: { id : 1 },
    update: {},
    create: {
      name: 'Juan Perez',
      mail: 'juan@example.com',
      phoneNumber: '1122334455',
      password: '123456',
      addressId: direccionTorcuato.id,
    },
  })

  const adminUser = await prisma.user.upsert({
    where: { id : 2 },
    update: {},
    create: {
      name: 'Admin',
      mail: 'Admin@Admin.com',
      phoneNumber: 'Admin',
      password: 'Admin',
      addressId: direccionTorcuato.id,
    },
  })

  const admin = await prisma.admin.upsert({
    where: {id: 2},
    update: {},
    create: {
      id: 2,
      idUser: adminUser.id
    },
  })

  const entrada = await prisma.foodCategory.upsert({
    where: {id : 1},
    update: {},
    create: {
      category: "Entrada"
    }
  })

  const postre = await prisma.foodCategory.upsert({
    where: {id : 2},
    update: {},
    create: {
      category: "Postre"
    }
  })

  const platoPrincipal = await prisma.foodCategory.upsert({
    where: {id : 3},
    update: {},
    create: {
      category: "Plato Principal"
    }
  })

  const stockeado = await prisma.dishState.upsert({
    where: {id : 1},
    update: {},
    create: {
      id: 1,
      name: "Stockeado"
    }
  })

  const agotado = await prisma.dishState.upsert({
    where: {id : 2},
    update: {},
    create: {
      id: 2,
      name: "Agotado"
    }
  })

  const descontinuado = await prisma.dishState.upsert({
    where: {id : 3},
    update: {},
    create: {
      id: 3,
      name: "Descontinuado"
    }
  })

  const preparada = await prisma.orderState.upsert({
    where: {id : 1},
    update: {},
    create: {
      state: "Pendiente"
    }

  })

  const enPreparacion = await prisma.orderState.upsert({
    where: {id : 2},
    update: {},
    create: {
      state: "En cocina"
    }
  })

  const enviado = await prisma.orderState.upsert({
    where: {id : 3},
    update: {},
    create: {
      state: "Enviado"
    }
  })

  const finalizada = await prisma.orderState.upsert({
    where: {id : 4},
    update: {},
    create: {
      state: "Finalizada"
    }

  })
  
  const libre = await prisma.tableState.upsert({
    where: {id : 1},
    update: {},
    create: {
      state: "Libre",
    }
  })
  const ocupada = await prisma.tableState.upsert({
    where: {id : 2},
    update: {},
    create: {
      state: "Ocupada",
    }
  })

  const reservada = await prisma.tableState.upsert({
    where: {id : 3},
    update: {},
    create: {
      state: "Reservada",
    }
  })
  
  const rabas = await prisma.dish.upsert({
    where: {id : 1},
    update: {},
    create: {
      name : "Rabas",
      desc : "Exquisitas rabas",
      price : 200.00,
      categoryId: entrada.id,
      dishStateId: stockeado.id,
    }
  })

  const pollo = await prisma.dish.upsert({
    where: {id : 2},
    update: {},
    create: {
      name : "Pollo A la Sal",
      desc : "El mejor pollo del mundo",
      price : 200.00,
      categoryId: platoPrincipal.id,
      dishStateId: agotado.id,
    }
  })

  const tiramisu = await prisma.dish.upsert({
    where: {id : 3},
    update: {},
    create: {
      name : "Pollo",
      desc : "Para el bajon",
      price : 200.00,
      categoryId: postre.id,
      dishStateId: descontinuado.id,
    }
  })


  const tableStates = [libre.id, ocupada.id, reservada.id]
  const tables = await Promise.all(
    Array.from({ length: 15 }).map((_, i) =>
      prisma.table.create({
        data: {
          size: 4,
          tableStateId: tableStates[i % 3], 
        },
      })
    )
  )
  

  const orderHeader = await prisma.orderHeader.upsert({
    where: {id : 1},
    update: {},
    create: {
      userId: juan.id,
      orderStateId: enPreparacion.id,
      orderAddressId: direccionTorcuato.id,
      total: 400.00,
      discount: 0,
    }

  })

  const orderDetail = await prisma.orderDetail.upsert({
    where: {id : 1},
    update: {},
    create: {
      orderHeaderId: orderHeader.id,
      dishId: rabas.id,
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
