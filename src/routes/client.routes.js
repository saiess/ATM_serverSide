const client = require('../controllers/client.controller')
const express = require('express')
const router = express.Router()

router.post('/', client.authenticate);
router.post('/phoneBill', client.phoneBill);
router.post('/carTax', client.carTax);
router.post('/ticket', client.ticket);
router.post('/recharge', client.recharge);

module.exports = router