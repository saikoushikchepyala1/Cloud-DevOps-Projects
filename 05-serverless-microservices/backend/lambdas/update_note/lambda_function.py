import json
import boto3
from datetime import datetime

dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table("SecureNotesTable")


def lambda_handler(event, context):
  
    user_id = event["requestContext"]["authorizer"]["claims"]["sub"]

    body = json.loads(event["body"])
    note_id = body["noteId"]

    now = datetime.utcnow().isoformat()

    update_clauses = []
    expression_values = {}

    if "title" in body:
        update_clauses.append("title = :title")
        expression_values[":title"] = body["title"]

    if "content" in body:
        update_clauses.append("content = :content")
        expression_values[":content"] = body["content"]

    if "isArchived" in body:
        update_clauses.append("isArchived = :isArchived")
        expression_values[":isArchived"] = body["isArchived"]

    if "isLocked" in body:
        update_clauses.append("isLocked = :isLocked")
        expression_values[":isLocked"] = body["isLocked"]

    if "isPinned" in body:
        update_clauses.append("isPinned = :isPinned")
        expression_values[":isPinned"] = body["isPinned"]

    if "isDeleted" in body:
        update_clauses.append("isDeleted = :isDeleted")
        expression_values[":isDeleted"] = body["isDeleted"]

    update_clauses.append("updatedAt = :updatedAt")
    expression_values[":updatedAt"] = now

    update_expression = "SET " + ", ".join(update_clauses)

    table.update_item(
        Key={
            "userId": user_id,
            "noteId": note_id,
        },
        UpdateExpression=update_expression,
        ExpressionAttributeValues=expression_values,
    )

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
        "body": json.dumps({
            "message": "Note updated successfully"
        }),
    }
