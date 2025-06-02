import { $db } from "../db";

export const getAllUser = async () => {
  return await $db.user.findMany({
    select: {
      id: true,
      name: true,
      mail: true,
      phoneNumber: true,
      userAddress: {
        select: {
          province: true,
          city: true,
          street: true,
          number: true,
          otherDetails: true,
        }
      }

    }
  })
}

export const getUserById = async (idUser: number) => {
  return await $db.user.findFirst({
    where: {
      id: idUser
    },
    select: {
      id: true,
      name: true,
      mail: true,
      phoneNumber: true,
      addressId: true,
      userAddress: {
        select: {
          province: true,
          city: true,
          street: true,
          number: true,
          otherDetails: true,
        }
      }

    }
  })
}

export const postUser = async (
  name: string,
  mail: string,
  phoneNumber: string,
  password: string,
  addressId: number
) => {
  return await $db.user.create({
    data: {
      name,
      mail,
      phoneNumber,
      password,
      addressId,
    },
    select: {
      id: true,
      name: true,
      mail: true,
      phoneNumber: true,
      userAddress: {
        select: {
          province: true,
          city: true,
          street: true,
          number: true,
          otherDetails: true,
        },
      },
    },
  });
};

export const deleteUser = async (iduser: number) => {
  return await $db.user.delete({
    where: { id: iduser }
  })
}

export const loginUser = async (mail: string) => {
  return await $db.user.findFirst({
    where: { mail: mail},
    select: {
      id: true,
      name: true,
      password: true
    }
  })

}