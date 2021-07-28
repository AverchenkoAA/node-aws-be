export async function basicAuthorizer(event: any, ctx: any, next: any) {
    console.log(`Event - ${JSON.stringify(event)}`);

    if (event['type'] != 'TOKEN') {
        next('Unauthorized');
    }

    try {
        const authToken = event.authorizationToken;
        const clearToken = authToken.split(' ')[1];
        const buffer = Buffer.from(clearToken, 'base64');
        const creds = buffer.toString('utf-8').split(':');
        const [username, password] = creds;

        console.log(`Event login with - ${username}//${password}`);

        const savedPassword = process.env[username];
        const access = savedPassword && savedPassword === password ? 'Allow' : 'Deny';

        const policy = generatePolicy(clearToken, event.methodArn, access);

        next(null, policy);
    } catch (error) {
        console.log(error);
        next(`Unauthorized: ${error}`);
    }
}

export function preSignUp(event: any, ctx: any, next: any) {
    console.log(event);
    event.response.autoConfirmUser = true;
    next(null, event);
}

function generatePolicy(principalId: any, resource: any, effect: any) {
    return {
        principalId: principalId,
        policyDocument: {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Action: "execute-api:Invoke",
                    Resource: resource
                }
            ]
        }

    }

}
