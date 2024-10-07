import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

// AWS S3 configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function GET() {
    try {
        // Prepare the parameters to list objects in the S3 bucket
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME, // Ensure the bucket name is correct in your env variables
            Prefix: 'exports/', // List only files in the exports directory
        };

        // Create and send the ListObjectsV2Command
        const command = new ListObjectsV2Command(params);
        const data = await s3.send(command);

        // Map through the files and extract file details
        const files = data.Contents?.map((file) => ({
            fileName: file.Key.split('/').pop(),
            createdAt: file.LastModified,
        })) || [];

        return new Response(JSON.stringify(files), { status: 200 });
    } catch (error) {
        console.error('Error listing files:', error);
        return new Response(JSON.stringify({ error: 'Failed to list files' }), { status: 500 });
    }
}
