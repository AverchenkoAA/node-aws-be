import AWS from 'aws-sdk';
import csv from 'csv-parser';
const BUCKET = 'aws-node-products';
const HEADER = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
};

export async function importProductsFile(event: any) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const name = event.queryStringParameters.name;
    console.log(`Input name - ${name}`);
    let status = 200;
    let res = '';
    const params = {
        Bucket: BUCKET,
        Key: `uploaded/${name}`,
        ContentType: 'text/csv',
        Expires: 120
    };

    try {
        const s3SignedUrl = s3.getSignedUrl('putObject', params);
        res = s3SignedUrl;
    } catch (error) {
        console.log(error);
        status = 500;
    }

    const response = {
        statusCode: status,
        headers: HEADER,
        body: JSON.stringify(res),
    };
    return response;
}

export async function importFileParser(event: any) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    console.log('event');
    console.log(event);

    const results: string[] = [];

    const response = {
        statusCode: 200,
        headers: HEADER,
    };

    const params = {
        Bucket: BUCKET,
        Key: ''
    };

    for (const record of event.Records) {
        console.log(`Processing record`);
        console.log(record.s3.object.key);
        params.Key = record.s3.object.key;
        console.log(params);
        const s3ReadStream = s3.getObject(params).createReadStream();

        // Read and Parse uploaded file
        await new Promise(() => {
            s3ReadStream
                .pipe(csv())
                .on('data', (data: any) => {
                    console.log(data);
                    results.push(data);
                })
                .on('error', (error: any) => {
                    console.log(error);
                    response.statusCode = 500;
                    Promise.resolve();
                })
                .on('end', () => {
                    console.log(results);
                    moveUploadedFile(s3, record);
                });
        });

    }

    return response;
}

async function moveUploadedFile(s3: AWS.S3, record: any) {
    // Move uploaded file to /parsed folder
    console.log('Start move uploaded file to /parsed folder');
    console.log(record.s3.object.key);
    await s3
        .copyObject({
            Bucket: BUCKET,
            CopySource: BUCKET + '/' + record.s3.object.key,
            Key: record.s3.object.key.replace('uploaded', 'parsed'),
        })
        .promise();

    await s3
        .deleteObject({
            Bucket: BUCKET,
            Key: record.s3.object.key,
        })
        .promise();

    console.log(
        `The file - ${record.s3.object.key} - was moved to /parsed folder`
    );
}
