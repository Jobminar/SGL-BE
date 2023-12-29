import jewelry from '../Model/jewelryModel.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jewelryController = {
  getAlljewelry: async function (req, res) {
    try {
      const allJewelry = await jewelry.find();
      res.status(200).json(allJewelry);
    } catch (error) {
      console.error('Error fetching jewelry:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  createjewelry: [
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

        const newjewelry = new jewelry({ name, price, weight, colour, subtype, units, value, shape, image });
        const savedjewelry = await newjewelry.save();

        res.status(201).json(savedjewelry);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
    }
  ],

  deletejewelry: async function (req, res) {
    try {
      const { id } = req.params;
      const jewelryItem = await jewelry.findById(id);

      if (!jewelryItem) {
        return res.status(404).json({ error: 'Jewelry not found' });
      }

      await jewelryItem.deleteOne({ _id: id });

      res.status(204).json({ message: 'Jewelry deleted successfully' });
    } catch (error) {
      console.error('Error deleting jewelry:', error);
      res.status(500).json({ error: 'Failed to delete jewelry', details: error.message });
    }
  }
};

export default jewelryController;
