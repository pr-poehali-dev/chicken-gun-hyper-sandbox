import json
import time
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict

@dataclass
class Player:
    id: str
    nickname: str
    position: Dict[str, float]
    rotation: float
    health: int
    is_shooting: bool
    color: str
    last_update: float

@dataclass
class Block:
    id: str
    position: Dict[str, float]
    type: str
    placed_by: str

game_state = {
    'players': {},
    'blocks': {},
    'bullets': []
}

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Business: Game server for multiplayer game - handle player actions, game state
    Args: event with httpMethod, body, queryStringParameters
    Returns: HTTP response with game state
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-Player-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    }
    
    if method == 'GET':
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({
                'players': list(game_state['players'].values()),
                'blocks': list(game_state['blocks'].values()),
                'bullets': game_state['bullets']
            })
        }
    
    if method == 'POST':
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        player_id = body_data.get('playerId')
        
        if action == 'join':
            nickname = body_data.get('nickname', 'Player')
            color = body_data.get('color', '#ff0000')
            
            game_state['players'][player_id] = {
                'id': player_id,
                'nickname': nickname,
                'position': {'x': 0, 'y': 1, 'z': 0},
                'rotation': 0,
                'health': 100,
                'is_shooting': False,
                'color': color,
                'last_update': time.time()
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'playerId': player_id,
                    'gameState': {
                        'players': list(game_state['players'].values()),
                        'blocks': list(game_state['blocks'].values())
                    }
                })
            }
        
        elif action == 'update':
            if player_id in game_state['players']:
                player = game_state['players'][player_id]
                
                if 'position' in body_data:
                    player['position'] = body_data['position']
                if 'rotation' in body_data:
                    player['rotation'] = body_data['rotation']
                if 'is_shooting' in body_data:
                    player['is_shooting'] = body_data['is_shooting']
                
                player['last_update'] = time.time()
                
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'isBase64Encoded': False,
                    'body': json.dumps({'success': True})
                }
        
        elif action == 'place_block':
            block_id = f"block_{len(game_state['blocks'])}"
            position = body_data.get('position')
            block_type = body_data.get('blockType', 'cube')
            
            game_state['blocks'][block_id] = {
                'id': block_id,
                'position': position,
                'type': block_type,
                'placed_by': player_id
            }
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({
                    'success': True,
                    'blockId': block_id
                })
            }
        
        elif action == 'shoot':
            bullet = {
                'id': f"bullet_{time.time()}",
                'position': body_data.get('position'),
                'direction': body_data.get('direction'),
                'shooter_id': player_id
            }
            game_state['bullets'].append(bullet)
            
            return {
                'statusCode': 200,
                'headers': headers,
                'isBase64Encoded': False,
                'body': json.dumps({'success': True})
            }
    
    if method == 'DELETE':
        params = event.get('queryStringParameters', {})
        player_id = params.get('playerId')
        
        if player_id and player_id in game_state['players']:
            del game_state['players'][player_id]
        
        return {
            'statusCode': 200,
            'headers': headers,
            'isBase64Encoded': False,
            'body': json.dumps({'success': True})
        }
    
    return {
        'statusCode': 405,
        'headers': headers,
        'isBase64Encoded': False,
        'body': json.dumps({'error': 'Method not allowed'})
    }
