import express from 'express';
import auth from '../middleware/auth.mjs';
import Event from '../models/Event.mjs';

const router = express.Router();

// Get all events for user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.userId }).sort({ startDate: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, reminder } = req.body;
    
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      reminder,
      user: req.userId
    });

    await event.save();
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOne({ _id: req.params.id, user: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updates = Object.keys(req.body);
    updates.forEach(update => event[update] = req.body[update]);
    await event.save();

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;