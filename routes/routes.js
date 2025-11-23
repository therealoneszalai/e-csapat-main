const express = require('express');
const Model = require('../Models/model');
const router = express.Router();
module.exports = router;

router.post('/', async (req, res) => {
  try {
    const markak = new Model(req.body);
    const savedmarkak = await markak.save();
    res.status(201).json(savedmarkak);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const  markak= await Model.find();
    res.status(200).json( markak);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const  markak = await Model.findById(id);
    if (! markak) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.status(200).json( markak);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch('/:id', async (req, res) => {
 try {
 const id = req.params.id;
 const updatedmarkak = req.body;
 const options = { new: true };
 const result = await Model.findByIdAndUpdate(
 id, updatedmarkak, options
 )
 res.send(result)
 }
 catch (error) {
 res.status(400).json({ message: error.message })
 }
});


router.delete('/:id', async (req, res) => {
 try {
 const id = req.params.id;
 const markak = await Model.findByIdAndDelete(id)
 res.send(`Document with ${markak.name} has been deleted..`)
 }
 catch (error) {
 res.status(400).json({ message: error.message })
 }
}) 
