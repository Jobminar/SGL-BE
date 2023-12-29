import Jewellary from '../Model/jewellaryModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jewellaryController = {
  getAllJewellary: async function (req, res) {
    try {
      const jewellary = await Jewellary.find();
      res.status(200).json(jewellary);
    } catch (error) {
      console.error('Error fetching jewellary:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createJewellary: [
    upload.single('image'),
    async function (req, res) {
      try {
        const { name, price, weight, colour, subtype, units, value, shape } = req.body;

        if (!req.file) {
          return res.status(400).json({ error: 'Image file is required' });
        }

        const image = req.file.buffer.toString('base64');

        if (!name || !price || !weight || !colour || !subtype || !units || !value || !shape) {
          return res.status(400).json({ error: 'All fields are required' });
        }

        const newJewellary = new Jewellary({ name, price, weight, colour, subtype, units, value, shape, image });
        const savedJewellary = await newJewellary.save();

        res.status(201).json(savedJewellary);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  ],

  deleteJewellary: async function (req, res) {
    try {
      const { id } = req.params;
      const jewellary = await Jewellary.findById(id);

      if (!jewellary) {
        return res.status(404).json({ error: 'Jewellary not found' });
      }

      await Jewellary.deleteOne({ _id: id });

      res.status(204).json({ message: 'Jewellary deleted successfully' });
    } catch (error) {
      console.error('Error deleting jewellary:', error);
      res.status(500).json({ error: 'Failed to delete jewellary', details: error.message });
    }
  }
};

export default jewellaryController;
