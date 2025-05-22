const express = require('express');
const mongoose = require('mongoose');
const Retailer = require('../models/Retailer');
const Product = require('../models/Product');
const router = express.Router();

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
    const leaders = await Retailer.find({ $or: [
      { isTeamLeader: true },
      { teamLeader: null }
    ]});
    res.json(leaders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching retailers' });
  }
});


router.get('/:id/stock', async (req, res) => {
  const retailer = await Retailer.findById(req.params.id);
  if (!retailer) return res.status(404).json({ error: 'Retailer not found' });

  const ownerId = retailer.teamLeader ? retailer.teamLeader._id || retailer.teamLeader : retailer._id;

  try {
    const products = await Product.find({
      assigned: true,
      'assignment.type': 'Retailer',
      'assignment.id': new mongoose.Types.ObjectId(ownerId)
    });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});



router.post('/:id/team-member', async (req, res) => {
  try {
    const leader = await Retailer.findById(req.params.id); 
    if (!leader || !leader.isTeamLeader) {
      return res.status(400).json({ error: 'Invalid team leader' });
    }

    const newMember = await Retailer.create({
      name: req.body.name,
      teamLeader: leader._id,
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
    const teamLeaderId = new mongoose.Types.ObjectId(req.params.id);
    const teamMembers = await Retailer.find({ teamLeader: teamLeaderId });
    res.json(teamMembers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching team members' });
  }
});

// DELETE a retailer or team member
router.delete('/:id', async (req, res) => {
  try {
    const deletedRetailer = await Retailer.findByIdAndDelete(req.params.id);
    if (!deletedRetailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    res.json({ message: 'Retailer deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete retailer' });
  }
});

// Update retailer by ID
router.put('/:id', async (req, res) => {
  try {
    const updatedRetailer = await Retailer.findByIdAndUpdate(
      req.params.id,
      req.body,  
      { new: true, runValidators: true }
    );
    if (!updatedRetailer) {
      return res.status(404).json({ message: 'Retailer not found' });
    }
    res.json(updatedRetailer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update retailer' });
  }
});


  router.get('/stock-count', async (req, res) => {
    try {
      const total = await Product.countDocuments({ assignedToType: 'retailer' });
      res.json({ total });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching retailer stock count' });
    }
  });

module.exports = router;
