import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dbConnect from '@/app/_lib/dbConnect';
import Subscription from '@/models/subscription';
import Charge from '@/models/charge';
import { v4 as uuidv4 } from 'uuid';  // For generating unique file names
import { format } from 'date-fns';    // For formatting the current date

// AWS S3 configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function POST(req) {
    // Restrict access to local environment or Heroku
    const allowedHosts = ['localhost', '127.0.0.1'];
    const host = req.headers.get('host');
    const forwardedFor = req.headers.get('x-forwarded-for');

    // Include the app URL if used
    if (process.env.APP_URL) {
        allowedHosts.push(process.env.APP_URL);
    }

    // Check if request is from an allowed host or forwarded IP
    if (!allowedHosts.some(allowedHost => host.includes(allowedHost) || forwardedFor?.includes(allowedHost))) {
        return new Response('Access denied', { status: 403 });
    }

    // Extract collection and status from request body
    const { collection, status } = await req.json();
    const collectionLower = collection.toLowerCase();
    const statusLower = status.toLowerCase();

    await dbConnect();

    let data;
    try {
        // Fetch the relevant data based on the collection and status
        switch (collectionLower) {
            case 'subscriptions':
                data = await Subscription.find({ status: statusLower }).lean();
                break;
            case 'charges':
                data = await Charge.find({ status: statusLower }).lean();
                break;
            default:
                return new Response(JSON.stringify({ error: 'Invalid collection' }), { status: 400 });
        }

        if (!data.length) {
            return new Response(JSON.stringify({ message: 'No data found' }), { status: 204 });
        }

        // Generate CSV content
        const csvContent = generateCSV(data);
        
        // Generate a unique filename
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        const uniqueString = uuidv4();  // Random unique string
        const filename = `${collectionLower}-${statusLower}_${currentDate}_${uniqueString}.csv`;

        // Upload CSV to S3
        const bucketName = process.env.AWS_S3_BUCKET_NAME;  // Make sure this is set in your .env
        const uploadParams = {
            Bucket: bucketName,
            Key: `exports/${filename}`,  // S3 folder path
            Body: csvContent,
            ContentType: 'text/csv'
        };

        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        return new Response(
            JSON.stringify({ message: 'Export successful', fileUrl: `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/exports/${filename}`, fileName: filename }),
            { status: 200 }
        );
    } catch (error) {
        console.error('Error during export:', error);
        return new Response(JSON.stringify({ error: 'Failed to export data' }), { status: 500 });
    }
}

// Helper function to generate CSV content
function generateCSV(data) {
    const escapeCSVValue = (value) => {
        if (typeof value === 'string') {
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n')) {
                value = `"${value}"`;
            }
        }
        return value;
    };

    const headers = Object.keys(data[0]).map(escapeCSVValue).join(',');
    const rows = data.map(row => Object.values(row).map(escapeCSVValue).join(',')).join('\n');
    
    return `${headers}\n${rows}`;
}
