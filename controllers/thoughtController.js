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
    async updateThought (req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$set: req.body},
                {runValidators: true, new: true}
                );
            
                if (!thought){
                    res.status(404).json({message: 'No thought found with this ID'});
                };
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeThought (req, res) {
        try {
            const thought = await Thought.findOneAndDelete({_id: req.params.thoughtId});

            if (!thought) {
                res.status(404).json({message: 'No thought found with this ID'});
            } 
            await User.findOneAndUpdate(
              { thoughts: req.params.thoughtId },
              { $pull: { thoughts: req.params.thoughtId } },
              { new: true });
            res.json({message: "Thought deleted!"});
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async addReaction (req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$addToSet: {reactions: req.body}},
                {new: true}
            );
            if (!reaction) {
                return res.status(404).json({message: 'No reaction or thought found with this ID'});
            }
            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    async removeReaction (req, res) {
        try {
            const reaction = await Thought.findOneAndUpdate(
                {_id: req.params.thoughtId},
                {$pull: {reactions: {reactionId: req.params.reactionId}}},
                {new: true}
            )
            if (!reaction) {
                res.status(404).json({message: 'No reaction found with this ID'});
            }
            res.json(reaction);
        } catch (err) {
            res.status(500).json(err);
        }
    },
};