import Beads from '../model/beadsModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const beadsController = {
  getBead: async (req, res) => {
    try {
      const beads = await Beads.find();
      res.status(200).json(beads);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createBeads: [
    upload.single('image'),
    async (req, res) => {
      try {
        const { name, price } = req.body;

        if (!req.file) {
          return res.status(400).json({ error: 'Image file is required' });
        }

        const image = req.file.buffer.toString('base64');

        if (!name || !price) {
          return res.status(400).json({ error: 'Beads name and price are required' });
        }

        const beads = new Beads({ name, price, image });
        const savedBeads = await beads.save(); 

        res.status(201).json(savedBeads);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  ],

  deleteBeads: async (req, res) => {
    try {
      const { id } = req.params;
      const beads = await Beads.findById(id);
  
      if (!beads) {
        return res.status(404).json({ error: 'Beads not found' });
      }
  
      await Beads.deleteOne({ _id: id }); 
  
      res.status(204).json({ message: 'Beads deleted successfully' });
    } catch (error) {
      console.error('Error deleting Beads:', error);
      res.status(500).json({ error: 'Failed to delete Beads', details: error.message });
    }
  }
};

export default beadsController;
