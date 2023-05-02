const { User, Thought } = require('../models');

module.exports = {
    async getAllThoughts (req, res) {
        try {
            const thought = await Thought.find();
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async getSingleThought (req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId});
            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    async createThought (req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findOneAndUpdate(
                {_id: req.body.userId},
                {$push: {thoughts: thought._id}},
                {new: true}
            );

            if (!user) {
                return res.status(404).json({message: 'Thought created, but no user with this ID was found'});
            }
            res.json({message: 'Thought Created'})
        } catch (err) {
            console.error(err);
        }
    },
    async updateThought (req, res) {},
    async removeThought (req, res) {},
    async addReaction (req, res) {},
    async removeReaction (req, res) {},
};