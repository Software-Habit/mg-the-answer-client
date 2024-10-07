// /src/app/_lib/cleanupScheduler.js
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';

// Define the cleanup function
const cleanupExports = () => {
    const exportDirectory = path.join(process.cwd(), 'public', 'exports');

    // Ensure the directory exists
    if (!fs.existsSync(exportDirectory)) {
        console.log('No exports directory found.');
        return;
    }

    // Read all files in the export directory
    fs.readdir(exportDirectory, (err, files) => {
        if (err) {
            console.error('Error reading exports directory:', err);
            return;
        }

        // Loop through each file and delete it
        files.forEach((file) => {
            const filePath = path.join(exportDirectory, file);
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error(`Error deleting file ${file}:`, err);
                } else {
                    console.log(`Deleted file: ${file}`);
                }
            });
        });
    });
};

// Schedule the cleanup to run every 1 hours
cron.schedule('0 */1 * * *', () => {
    console.log('Running cleanup of exports directory');
    cleanupExports();
}, {
    timezone: 'America/New_York', // Adjust to your preferred timezone
});

// Export the cleanup function (optional if you want to run it manually)
export default cleanupExports;
