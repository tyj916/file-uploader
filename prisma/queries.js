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
    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: password,
      }
    });
  } catch(err) {
    console.error(err);
  }
}

async function getUserById(id) {
  try {
    return await prisma.user.findFirst({
      where: { id: id },
    });
  } catch(err) {
    console.error(err);
  }
}

async function getUserByUsername(username) {
  try {
    return await prisma.user.findFirst({
      where: { username: username },
    });
  } catch(err) {
    console.error(err);
  }
}

async function createFolder(folderName, user) {
  try {
    const result = await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: user.id,
      }
    });
    console.log(result);
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  createFolder,
}