const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function template() {
  try {

  } catch(err) {
    console.error(err);
  }
}

async function createUser(user, password) {
  try {
    const newUser = await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: password,
      }
    });
    console.log(newUser);
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  createUser
}