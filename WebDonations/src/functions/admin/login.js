const express = require("express");
const router = express.Router();
const db = require("../config/database"); // adjust path as needed
const bcrypt = require("bcryptjs");

// POST /admin/login
router.post("/", async(req, res) => {
    const { username, password } = req.body;
    if (!username || !password)
        return res.status(400).json({ success: false, message: "Username and password required." });

    try {
        const [rows] = await db.promise().query(
            "SELECT id, username, password, role FROM admins WHERE username=?", [username]
        );
        if (!rows.length)
            return res.status(401).json({ success: false, message: "Invalid username or password." });

        const admin = rows[0];
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch)
            return res.status(401).json({ success: false, message: "Invalid username or password." });

        // Set session or JWT (here using session)
        req.session.admin_id = admin.id;
        req.session.admin_username = admin.username;
        req.session.admin_role = admin.role;

        return res.json({
            success: true,
            message: "Login successful.",
            admin: {
                id: admin.id,
                username: admin.username,
                role: admin.role
            }
        });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;