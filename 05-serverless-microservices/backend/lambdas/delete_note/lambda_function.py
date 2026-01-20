import json
import boto3

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("SecureNotesTable")

def lambda_handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    params = event.get("queryStringParameters") or {}
    note_id = params.get("noteId")

    if not note_id:
        return {
            "statusCode": 400,
            "headers": {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            "body": json.dumps({"error": "noteId is required"}),
        }

    table.delete_item(
        Key={
            "userId": user_id,
            "noteId": note_id,
        }
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({"message": "Note permanently deleted"}),
    }
