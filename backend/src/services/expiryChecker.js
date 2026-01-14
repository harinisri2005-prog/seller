import pool from "../db.js";

// Service to check and deactivate expired posts
export const checkExpiredPosts = async () => {
    try {
        const result = await pool.query(`
            UPDATE posts 
            SET status = 'EXPIRED' 
            WHERE expiry_date < NOW() 
            AND status = 'ACTIVE'
            RETURNING id, offer_period, expiry_date
        `);

        if (result.rows.length > 0) {
            console.log(`Deactivated ${result.rows.length} expired posts:`, result.rows);
        }

        return result.rows;
    } catch (err) {
        console.error("Error checking expired posts:", err);
        throw err;
    }
};

// Run check every 5 minutes
export const startExpiryChecker = () => {
    console.log("Starting expiry checker service...");

    // Run immediately on start
    checkExpiredPosts().catch(console.error);

    // Then run every 5 minutes
    const intervalMs = 5 * 60 * 1000; // 5 minutes
    setInterval(() => {
        checkExpiredPosts().catch(console.error);
    }, intervalMs);

    console.log("Expiry checker is running (checking every 5 minutes)");
};
