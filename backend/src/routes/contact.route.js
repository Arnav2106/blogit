import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    getContacts,
    searchUserByEmail,
    addContact,
    removeContact,
} from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", protectRoute, getContacts);
router.get("/search", protectRoute, searchUserByEmail);
router.post("/add/:id", protectRoute, addContact);
router.delete("/:id", protectRoute, removeContact);

export default router;
