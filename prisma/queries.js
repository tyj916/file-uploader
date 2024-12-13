const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createUser(user, password) {
  try {
    await prisma.user.create({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        password: password,
        folders: {
          create: {
            name: 'My files',
          }
        }
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

async function createFolder(folderName, userId, parentId) {
  try {
    await prisma.folder.create({
      data: {
        name: folderName,
        ownerId: +userId,
        parentId: +parentId,
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
        id: +folderId,
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

async function updateFolder(folderId, newName) {
  try {
    await prisma.folder.update({
      where: {
        id: +folderId,
      },
      data: {
        name: newName,
      }
    });
  } catch(err) {
    console.error(err);
  }
}

async function removeFolderById(folderId) {
  try {
    await prisma.folder.delete({
      where: {
        id: +folderId,
      },
    });
  } catch(err) {
    console.error(err);
  }
}

module.exports = {
  createUser,
  getUserById,
  getUserByUsername,
  createFolder,
  getFolderByFolderId,
  getRootFolderByOwnerId,
  updateFolder,
  removeFolderById,
}