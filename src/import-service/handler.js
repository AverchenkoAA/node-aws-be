const AWS = require('aws-sdk');
const BUCKET = 'aws-node-products';
const HEADER = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
}

module.exports = {
    importProductsFile: async function () {
        const s3 = new AWS.S3({ region: 'eu-west-1'});
        let status = 200;
        let res = [];
        const params = {
            Bucket: BUCKET,
            Prefix: 'uploaded/'
        };
        try {
            const s3Response = await s3.listObjectsV2(params).promise();
            res = s3Response.Contents;
        } catch (error) {
            console.log(error);
            status = 500;
        }

        const response = {
            statusCode: status,
            headers: HEADER,
            body: JSON.stringify(res
                .filter(item => item.Size)
                .map(item => `https://${BUCKET}.s3.amazonaws.com/${item.Key}`)
                ),
        };
        return response
    }
}
