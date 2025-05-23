import { $db } from "../db";

export const getAllAddresses = async() => {
    return $db.address.findMany(
        {
            select: {
                id: true,
                province: true,
                city:true,
                street:true,
                number: true,
                otherDetails:true,
            }
        }
    );
}


export const getAddressById = async(id: number) => {
    return $db.address.findUnique(
        {
            where: {id: id},
            select: {
                id: true,
                province: true,
                city:true,
                street:true,
                number: true,
                otherDetails:true,
            }
        }
    );
}

export const postAddress = async (
    province: string,
    city: string,
    street: string,
    number: string,
    otherDetails: string
  ) => {
    return await $db.address.create({
      data: {
        province,
        city,
        street,
        number,
        otherDetails,
      },
      select: {
        id: true,
        province: true,
        city: true,
        street: true,
        number: true,
        otherDetails: true,
      },
    });
  };
  