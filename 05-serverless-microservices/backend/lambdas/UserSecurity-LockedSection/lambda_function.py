import json
import os
import boto3
import hashlib
from datetime import datetime, timedelta
from botocore.exceptions import ClientError

dynamodb = boto3.resource("dynamodb")
cognito = boto3.client("cognito-idp")

TABLE_NAME = os.environ["TABLE_NAME"]
USER_POOL_ID = os.environ["USER_POOL_ID"]
USER_POOL_CLIENT_ID = os.environ["USER_POOL_CLIENT_ID"]

table = dynamodb.Table(TABLE_NAME)

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def get_claims(event):
    return event["requestContext"]["authorizer"]["claims"]

def response(status, body):
    return {
        "statusCode": status,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(body)
    }

def verify_account_password(username, password):
    try:
        cognito.admin_initiate_auth(
            UserPoolId=USER_POOL_ID,
            ClientId=USER_POOL_CLIENT_ID,
            AuthFlow="ADMIN_NO_SRP_AUTH",
            AuthParameters={
                "USERNAME": username,
                "PASSWORD": password
            }
        )
        return True
    except ClientError:
        return False

def lambda_handler(event, context):
    claims = get_claims(event)
    user_id = claims["sub"]
    username = claims["cognito:username"]
    method = event.get("httpMethod")

    if method == "GET":
        res = table.get_item(Key={"userId": user_id})
        return response(200, {"hasPassword": "Item" in res and "lockedPasswordHash" in res["Item"]})

    if method != "POST":
        return response(405, {"error": "Method not allowed"})

    try:
        body = json.loads(event.get("body", "{}"))
    except Exception:
        return response(400, {"error": "Invalid JSON"})

    action = body.get("action")

    if action == "verifyAccount":
        account_password = body.get("accountPassword")
        if not account_password:
            return response(400, {"error": "Account password required"})

        if not verify_account_password(username, account_password):
            return response(401, {"verified": False})

        table.update_item(
            Key={"userId": user_id},
            UpdateExpression="SET verified = :v, verifiedUntil = :t",
            ExpressionAttributeValues={
                ":v": True,
                ":t": (datetime.utcnow() + timedelta(minutes=5)).isoformat()
            }
        )
        return response(200, {"verified": True})

    if action == "set":
        password = body.get("password")
        if not password:
            return response(400, {"error": "Password required"})

        res = table.get_item(Key={"userId": user_id})
        item = res.get("Item")

        if not item or "lockedPasswordHash" not in item:
            table.update_item(
                Key={"userId": user_id},
                UpdateExpression="SET lockedPasswordHash = :h, updatedAt = :t",
                ExpressionAttributeValues={
                    ":h": hash_password(password),
                    ":t": datetime.utcnow().isoformat()
                }
            )
            return response(200, {"message": "Password set"})

        if (
            not item.get("verified")
            or datetime.utcnow() > datetime.fromisoformat(item["verifiedUntil"])
        ):
            return response(403, {"error": "Account verification required"})

        table.update_item(
            Key={"userId": user_id},
            UpdateExpression="""
                REMOVE verified, verifiedUntil
                SET lockedPasswordHash = :h, updatedAt = :t
            """,
            ExpressionAttributeValues={
                ":h": hash_password(password),
                ":t": datetime.utcnow().isoformat()
            }
        )
        return response(200, {"message": "Password set"})

    if action == "verify":
        password = body.get("password")
        if not password:
            return response(400, {"error": "Password required"})

        res = table.get_item(Key={"userId": user_id})
        if "Item" not in res or "lockedPasswordHash" not in res["Item"]:
            return response(403, {"error": "Password not set"})

        if res["Item"]["lockedPasswordHash"] == hash_password(password):
            return response(200, {"success": True})

        return response(401, {"success": False})

    return response(400, {"error": "Invalid action"})