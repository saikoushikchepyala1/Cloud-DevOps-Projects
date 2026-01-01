import json
import uuid
import boto3
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('guestbook-table')

def lambda_handler(event, context):
    body = json.loads(event.get('body', '{}'))

    message = body.get('message', '').strip()
    name = body.get('name', 'Anonymous')

    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Message is required'})
        }

    item = {
        'id': str(uuid.uuid4()),
        'name': name,
        'message': message,
        'createdAt': datetime.utcnow().isoformat()
    }

    table.put_item(Item=item)

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*'},
        'body': json.dumps({'message': 'Message added successfully'})
    }
