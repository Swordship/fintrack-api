const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createInvoice = async (req ,res) => {
    const {amount, clientId ,status} = req.body;
    
    const userId = req.user.userId;

    try{
        const newInvoice = await prisma.invoice.create({
            data : {
                amount : amount,
                clientId : clientId,
                status : status,
                userId : userId
            }
        });
        return res.status(201).json(newInvoice);
    }
    catch(error){
        return res.status(500).json({error : 'Failed to create invoice'});
    }
}
const getAllInvoice = async (req, res) => {
  const userId = req.user.userId; // Get the userId from the middleware

  try {
    const invoice = await prisma.invoice.findMany({
      where: {
        userId: userId 
      },
    });
    res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
}
const updateInvoice = async (req ,res) => {
    const {id} = req.params;
    const {amount,status} = req.body;
    const userId = req.user.userId;

    try{
        const updatedInvoice = await prisma.invoice.updateMany({
            where : {
                id : id,
                userId : userId
            },
            data : {
                amount : amount,
                status : status
            }
        });
        if(updatedInvoice.count === 0){
            return res.status(404).json({error : 'Invoice not found or unauthorized'});
        }   
        return res.status(200).json({message : 'Invoice updated successfully'});
    }
    catch(error){
        return res.status(500).json({error : 'Failed to update invoice'});
    }
}
const deleteInvoice = async (req ,res) => {
    const {id} = req.params;
    const userId = req.user.userId;

    try{
        const deletedInvoice = await prisma.invoice.deleteMany({
            where :{
                id:id,
                userId : userId
            }
        });
        if(deletedInvoice.count === 0){
            return res.status(404).json({error : 'Invoice not found or unauthorized'});
        }
        return res.status(200).json({message : 'Invoice deleted successfully'});
    }
    catch(error){
        return res.status(500).json({error : 'Failed to delete invoice'});
    }
}
const getoneInvoice = async (req ,res) => {
    const {id} = req.params;
    const userId = req.user.userId;
    try{
        const invoice = await prisma.invoice.findFirst({
            where : {
                id : id,
                userId : userId
            }
        });
        if(!invoice){
            return res.status(404).json({error : 'Invoice not found or unauthorized'});
        }
        return res.status(200).json(invoice);
    }
    catch(error){
        return res.status(500).json({error : 'Failed to fetch invoice'});
    }
}
module.exports = {
    createInvoice,
    updateInvoice,
    getAllInvoice,
    deleteInvoice,
    getoneInvoice
}