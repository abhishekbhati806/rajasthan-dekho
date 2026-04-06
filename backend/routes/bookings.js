const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

// CREATE BOOKING (public)
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, city, message } = req.body;

        const booking = new Booking({ name, email, phone, city, message });
        await booking.save();

        res.json({ success: true, message: 'Booking saved!', booking });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// GET ALL BOOKINGS (admin only)
router.get('/', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }

        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json({ success: true, bookings });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// UPDATE BOOKING STATUS (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );

        res.json({ success: true, booking });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// DELETE BOOKING (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admins only' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Booking deleted' });

    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;