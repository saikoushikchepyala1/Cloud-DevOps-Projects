import json
import boto3
import uuid
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("SecureNotesTable")


def lambda_handler(event, context):
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]
    body = json.loads(event["body"])

    note_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()

    item = {
        "userId": user_id,
        "noteId": note_id,
        "title": body.get("title", ""),
        "content": body.get("content", ""),
        "isArchived": body.get("isArchived", False),
        "isLocked": body.get("isLocked", False),
        "isPinned": body.get("isPinned", False),
        "isDeleted": False,
        "createdAt": now,
        "updatedAt": now,
    }

    table.put_item(Item=item)

    return {
        "statusCode": 201,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps(item),
    }
