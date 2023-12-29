
import Contacts from "../model/contactModel.js";

const contactController = {
  createContact: async (req, res) => {
    try {
      const { name, email, mobile, message } = req.body;


      if (!name || !email || !mobile || !message) {
        return res.status(400).json({ error: 'All fields are required' });
      }

      const newContact = new Contacts({ name, email, mobile, message });
      const savedContact = await newContact.save();

      res.status(201).json(savedContact);
    } catch (error) {
      console.error('Error creating contact:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  getAllContact: async (req, res) => {
    try {
      const contacts = await Contacts.find();
      res.status(200).json(contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await Contacts.findById(id);

      if (!contact) {
        return res.status(404).json({ error: 'Contact not found' });
      }

      await Contacts.deleteOne({ _id: id });

      res.status(204).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error('Error deleting contact:', error);
      res.status(500).json({ error: 'Failed to delete contact', details: error.message });
    }
  }
};

export default contactController;
