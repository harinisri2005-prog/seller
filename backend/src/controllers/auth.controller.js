import pool from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/* ---------------- SIGNUP ---------------- */
export const signup = async (req, res) => {
  try {
    const { shopName, ownerName, email, phone, password, kycUrls } = req.body;

    if (!shopName || !ownerName || !email || !phone || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (!kycUrls || !kycUrls.AADHAAR || !kycUrls.PAN || !kycUrls.GST) {
      return res.status(400).json({ message: "Required KYC documents missing" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorResult = await pool.query(
      `INSERT INTO vendors 
       (shop_name, owner_name, email, phone, password_hash, status)
       VALUES ($1,$2,$3,$4,$5, 'PENDING')
       RETURNING id, shop_name, owner_name, email, status`,
      [shopName, ownerName, email, phone, hashedPassword]
    );

    const vendor = vendorResult.rows[0];
    const vendorId = vendor.id;

    for (const [docType, url] of Object.entries(kycUrls)) {
      if (url) {
        await pool.query(
          `INSERT INTO kyc_documents (vendor_id, doc_type, file_url)
           VALUES ($1,$2,$3)`,
          [vendorId, docType, url]
        );
      }
    }

    // Generate Auto Login Token
    const token = jwt.sign(
      { id: vendor.id, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(201).json({
      message: "Signup successful. Await admin approval.",
      token,
      vendorStatus: vendor.status,
      vendor: {
        id: vendor.id,
        shopName: vendor.shop_name,
        ownerName: vendor.owner_name,
        email: vendor.email
      }
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    if (err.code === '23505') { // Unique violation (e.g. email)
      return res.status(400).json({ message: "Email already registered" });
    }
    return res.status(500).json({ message: "Signup failed" });
  }
};

/* ---------------- LOGIN ---------------- */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT * FROM vendors WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const vendor = result.rows[0];

    const match = await bcrypt.compare(password, vendor.password_hash);
    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: vendor.id, role: "VENDOR" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.json({
      token,
      vendorStatus: vendor.status,
      vendor: {
        id: vendor.id,
        shopName: vendor.shop_name,
        ownerName: vendor.owner_name,
        email: vendor.email
      }
    });

  } catch (err) {
    return res.status(500).json({ message: "Login failed" });
  }
};
