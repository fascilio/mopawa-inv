const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const Invoice = require('../models/Invoice');

router.post('/create', async (req, res) => {
  try {
    const { name, isTeamLeader } = req.body;
    const retailer = await Retailer.create({ name, isTeamLeader: !!isTeamLeader });
    res.status(201).json(retailer);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create retailer' });
  }
});

router.get('/', async (req, res) => {
  try {
    const leaders = await Retailer.findAll({
      where: {
        [Op.or]: [
          { isTeamLeader: true },
          { teamLeaderId: null }
        ]
      }
    });
    res.json(leaders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching retailers' });
  }
});

router.get('/:id/stock', async (req, res) => {
  try {
    const retailer = await Retailer.findByPk(req.params.id);
    if (!retailer) return res.status(404).json({ error: 'Retailer not found' });

    const ownerId = retailer.teamLeaderId || retailer.id;

    const products = await Product.findAll({
      where: {
        assigned: true,
        assignmentType: 'Retailer',
        assignmentId: ownerId
      }
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id/invoices', async (req, res) => {
  try {
    const retailerId = req.params.id;
    const invoices = await Invoice.findAll({
      where: {
        customerType: 'Retailer',
        customerId: retailerId
      },
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch invoices' });
  }
});

router.post('/:id/team-member', async (req, res) => {
  try {
    const leader = await Retailer.findByPk(req.params.id);
    if (!leader || !leader.isTeamLeader) {
      return res.status(400).json({ error: 'Invalid team leader' });
    }

    const newMember = await Retailer.create({
      name: req.body.name,
      teamLeaderId: leader.id,
      isTeamLeader: false
    });

    res.status(201).json(newMember);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create team member' });
  }
});

router.get('/:id/team-members', async (req, res) => {
  try {
    const teamMembers = await Retailer.findAll({
      where: { teamLeaderId: req.params.id }
    });
    res.json(teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching team members' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedRetailer = await Retailer.destroy({ where: { id: req.params.id } });
    if (!deletedRetailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    res.json({ message: 'Retailer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete retailer' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [updated] = await Retailer.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ message: 'Retailer not found' });
    }

    const updatedRetailer = await Retailer.findByPk(req.params.id);
    res.json(updatedRetailer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update retailer' });
  }
});

router.get('/stock-count', async (req, res) => {
  try {
    const total = await Product.count({
      where: { assignedType: 'Retailer' }
    });
    res.json({ total });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching retailer stock count' });
  }
});

module.exports = router;
