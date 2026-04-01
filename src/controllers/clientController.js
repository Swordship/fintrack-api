const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a new client
const createClient = async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId; // 👈 Get the userId from the middleware!

  try {
    const newClient = await prisma.client.create({
      data: {
        name: name,
        userId: userId, // Link the client to the logged-in user
      },
    });
    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
};
const getAllClients = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the middleware

  try {
    const clients = await prisma.client.findMany({
      where: {
        userId: userId 
      },
    });
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
}
const updateClient = async (req,res)=>{
  const {name} = req.body;
  const {id} = req.params;
  const userId = req.user.userId;

  try{
    const updateClient = await prisma.client.updateMany({
      where:{
        id : id,
        userId : userId
      },
      data:{
        name : name
      },
    });
    if(updateClient.count === 0){
      return res.status(404).json({
        error : 'Client not found or unauthorized'
      });
    }
    res.status(200).json({message : 'Client updated successfully'});
  }catch(error){
    res.status(500).json({error : 'Failed to update client'});
  }
}
const deleteClient = async (req,res)=>{
  const {id} = req.params;
  const userId = req.user.userId;
  console.log('--- DEBUGGING DELETE ---');
  console.log('Client ID to delete:', id);
  console.log('User ID who is deleting:', userId);

  try{
    const deleteClient = await prisma.client.deleteMany({
      where:{
        id:id,
        userId : userId
      },
    });
    if(deleteClient.count === 0){
      return res.status(404).json({
        error : 'Client not found or unauthorized'
      });
    }
    res.status(200).json({message : 'Client deleted successfully'});
  }
  catch(error){
    res.status(500).json({error : 'Failed to delete client'});
  }
}
module.exports = {
  createClient,
  getAllClients,
  updateClient,
  deleteClient
};