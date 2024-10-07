import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// AWS S3 configuration
const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName'); // Extract the filename

    // Log the incoming request to ensure that fileName is being passed correctly
    console.log("Requested File:", fileName);

    if (!fileName) {
        return new Response(JSON.stringify({ error: 'File name is required' }), { status: 400 });
    }

    try {
        // Define the S3 parameters
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME, // Ensure this is correctly set in your environment
            Key: `exports/${fileName}` // Ensure the file path is correct
        };

        // Log the S3 parameters to check correctness
        console.log("S3 Params:", params);

        // Create a GetObjectCommand instance
        const command = new GetObjectCommand(params);

        // Generate a pre-signed URL with an expiry time of 60 seconds
        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });

        // Log the generated signed URL for verification
        console.log("Generated Signed URL:", signedUrl);

        // Return the presigned URL
        return new Response(JSON.stringify({ url: signedUrl }), { status: 200 });
    } catch (error) {
        // Log the error to help diagnose the issue
        console.error('Error generating pre-signed URL:', error);

        // Return an error response with more information
        return new Response(JSON.stringify({ error: 'Failed to generate download link', details: error.message }), { status: 500 });
    }
}
