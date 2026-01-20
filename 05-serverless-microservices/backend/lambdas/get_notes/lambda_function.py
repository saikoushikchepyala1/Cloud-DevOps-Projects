import json
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("SecureNotesTable")


def lambda_handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    response = table.query(
        KeyConditionExpression=Key("userId").eq(user_id)
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(response.get("Items", [])),
    }
