import Corals from '../model/coralsModel.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
//new changes added 5:29pm
const coralsController = {
  getCorals: async (req, res) => {
    try {
      const corals = await Corals.find();
      res.status(200).json(corals);
    } catch (error) {
      console.error('Error fetching corals:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createCorals: [
    upload.single('image'),
    async (req, res) => {
      try {
        const { name, price, weight, colour, subtype, units, value, shape } = req.body;
  
        if (!req.file) {
          return res.status(400).json({ error: 'Image file is required' });
        }
  
        const image = req.file.buffer.toString('base64');
  
        if (!name || !price || !weight || !colour) {
          return res.status(400).json({ error: 'Corals name, price, weight, and colour are required' });
        }
  
        // Include all required fields from your schema
        const corals = new Corals({ name, price, weight, colour, image, subtype, units, value, shape });
        const savedcorals = await corals.save();
  
        res.status(201).json(savedcorals);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    },
  ],
  

  deleteCorals: async (req, res) => {
    try {
      const { id } = req.params;
      const corals = await Corals.findById(id);

      if (!corals) {
        return res.status(404).json({ error: 'Corals not found' });
      }

      await Corals.deleteOne({ _id: id });

      res.status(204).json({ message: 'Corals deleted successfully' });
    } catch (error) {
      console.error('Error deleting Corals:', error);
      res.status(500).json({ error: 'Failed to delete Corals', details: error.message });
    }
  },
};

export default coralsController;
