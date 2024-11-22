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
    return await prisma.user.findUnique({
      where: { id: id },
    });
  } catch(err) {
    console.error(err);
  }
}

async function getUserByUsername(username) {
  try {
    return await prisma.user.findUnique({
      where: { username: username },
    });
  } catch(err) {
    console.error(err);
  }
}

async function createFolder(folderName, user) {
  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: user.id,
      }
    });
  } catch(err) {
    console.error(err);
  }
}

async function getFolderByFolderId(folderId) {
  try {
    return await prisma.folder.findUnique({
      include: {
        childFolders: true,
        files: true,
      },
      where: {
        id: folderId,
      },
    })
  } catch(err) {
    console.error(err);
  }
}

async function getRootFolderByOwnerId(ownerId) {
  try {
    return await prisma.folder.findFirst({
      include: {
        childFolders: true,
        files: true,
      },
      where: {
        ownerId: ownerId,
        parentId: null,
      }
    });
  } catch (err) {
    console.error(err);
  }
}

async function removeFolderById(folderId) {
  try {
    await prisma.folder.delete({
      where: {
        id: folderId,
      },
    });
  } catch(err) {
    console.error(err);
  }
}

(async () => {
  console.log(await getUserById(1));
  console.log(await getRootFolderByOwnerId(1));
  await removeFolderById(3);
  console.log(await getFolderByFolderId(3));
})();

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  createFolder,
}