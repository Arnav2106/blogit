import User from "../models/user.model.js";

export const getContacts = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate(
            "contacts",
            "-password"
        );
        res.status(200).json(user.contacts);
    } catch (error) {
        console.log("Error in getContacts:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const searchUserByEmail = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({ message: "Email query is required" });
        }

        const user = await User.findOne({
            email: { $regex: new RegExp(`^${email}$`, "i") },
            _id: { $ne: req.user._id },
        }).select("-password");

        if (!user) {
            return res.status(200).json([]);
        }

        // Check if already a contact
        const currentUser = await User.findById(req.user._id);
        const isContact = currentUser.contacts.some(
            (contactId) => contactId.toString() === user._id.toString()
        );

        res.status(200).json([
            {
                _id: user._id,
                fullName: user.fullName,
                email: user.email,
                profilePic: user.profilePic,
                isContact,
            },
        ]);
    } catch (error) {
        console.log("Error in searchUserByEmail:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const addContact = async (req, res) => {
    try {
        const { id: contactId } = req.params;
        const userId = req.user._id;

        if (contactId === userId.toString()) {
            return res.status(400).json({ message: "Cannot add yourself as a contact" });
        }

        const contactUser = await User.findById(contactId);
        if (!contactUser) {
            return res.status(404).json({ message: "User not found" });
        }

        // Add contact mutually (both directions)
        await User.findByIdAndUpdate(userId, {
            $addToSet: { contacts: contactId },
        });
        await User.findByIdAndUpdate(contactId, {
            $addToSet: { contacts: userId },
        });

        res.status(200).json({ message: "Contact added successfully" });
    } catch (error) {
        console.log("Error in addContact:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const removeContact = async (req, res) => {
    try {
        const { id: contactId } = req.params;
        const userId = req.user._id;

        // Remove contact mutually
        await User.findByIdAndUpdate(userId, {
            $pull: { contacts: contactId },
        });
        await User.findByIdAndUpdate(contactId, {
            $pull: { contacts: userId },
        });

        res.status(200).json({ message: "Contact removed successfully" });
    } catch (error) {
        console.log("Error in removeContact:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};
