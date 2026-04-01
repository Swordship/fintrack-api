const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const authMiddleware = require('../middleware/authMiddleware');

const {createInvoiceSchema, updateInvoiceSchema} = require('../schema/invoiceSchema');
const validate = require('../middleware/validate');

router.post('/createInvoice',authMiddleware, validate(createInvoiceSchema), invoiceController.createInvoice);

router.put('/updateInvoice/:id',authMiddleware, validate(updateInvoiceSchema), invoiceController.updateInvoice);  

router.get('/getInvoices',authMiddleware, invoiceController.getAllInvoice);

router.delete('/deleteInvoice/:id',authMiddleware, invoiceController.deleteInvoice);

router.get('/getInvoice/:id',authMiddleware, invoiceController.getoneInvoice);
module.exports = router;