const AWS = require('aws-sdk');
const csv = require('csv-parser');
const BUCKET = 'aws-node-products';
const HEADER = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports = {
  importProductsFile: async function (event) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });
    const name = event.queryStringParameters.name;
    console.log(`Input name - ${name}`);
    let status = 200;
    let res = [];
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
  },

  importFileParser: async function (event) {
    const s3 = new AWS.S3({ region: 'eu-west-1' });

    console.log('event');
    console.log(event);

    const results = [];

    const response = {
      statusCode: 200,
      headers: HEADER,
    };

    const params = {
      Bucket: BUCKET,
    };

    for (const record of event.Records) {
      console.log(`Processing record`);
      console.log(record.s3.object.key);
      params.Key = record.s3.object.key;
      console.log(params);
      const s3ReadStream = s3.getObject(params).createReadStream();

      // Read and Parse uploaded file
      await new Promise((resolve) => {
        s3ReadStream
          .pipe(csv())
          .on('data', (data) => {
            console.log(data);
            results.push(data);
          })
          .on('error', (error) => {
            console.log(error);
            response.statusCode = 500;
            resolve();
          })
          .on('end', () => {
            console.log(results);
            resolve();
          });
      });

      // Move uploaded file to /parsed folder
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

    return response;
  },
};
