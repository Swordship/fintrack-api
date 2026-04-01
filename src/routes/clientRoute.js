const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authenticate = require('../middleware/authMiddleware');

router.post('/createClients', authenticate, clientController.createClient);

router.get('/getClients',authenticate, clientController.getAllClients);

router.put('/updateClient/:id',authenticate, clientController.updateClient);

router.delete('/deleteClient/:id',authenticate, clientController.deleteClient);
module.exports = router;