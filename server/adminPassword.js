import db from './db/connect.js';
import bcrypt from 'bcrypt';
import readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const adminPassword = async () => {
    try {
        await db.init();
        const admin = await db.all('SELECT * FROM admin');
        
        rl.question('Enter new admin password: ', async (password) => {
            const hashedPassword = await bcrypt.hash(password, 10);

            if (admin.length === 0) {
                // If no admin rows exist, create a new row
                await db.all('INSERT INTO admin (password) VALUES (?)', [hashedPassword]);
                console.log("Admin password created.");
            } else {
                // If admin row(s) exist, update the existing row
                await db.all('UPDATE admin SET password = ? WHERE id = ?', [hashedPassword, admin[0].id]);
                console.log("Admin password updated.");
            }

            rl.close();
            process.exit(0);
        });
    } catch (err) {
        console.error('Error changing admin password:', err);
        rl.close();
        process.exit(1);
    }
}

adminPassword();