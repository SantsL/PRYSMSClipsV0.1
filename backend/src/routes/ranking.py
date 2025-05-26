from flask import Blueprint, request, jsonify, session
import json

ranking_bp = Blueprint('ranking', __name__, url_prefix='/api/ranking')

# Simulação de banco de dados de jogadores para ranking
players_db = [
    {
        "id": "user1",
        "username": "ProGamer123",
        "rank": 1,
        "followers": 25000,
        "clips": 87,
        "following": True
    },
    {
        "id": "user2",
        "username": "GameMaster",
        "rank": 2,
        "followers": 18500,
        "clips": 65,
        "following": False
    },
    {
        "id": "user3",
        "username": "NinjaStreamer",
        "rank": 3,
        "followers": 15200,
        "clips": 54,
        "following": True
    },
    {
        "id": "user4",
        "username": "GamerGirl",
        "rank": 4,
        "followers": 12800,
        "clips": 42,
        "following": False
    },
    {
        "id": "user5",
        "username": "EsportsLegend",
        "rank": 5,
        "followers": 10500,
        "clips": 38,
        "following": False
    }
]

# Simulação de banco de dados de jogos
games_db = [
    {"id": "game1", "name": "Fortnite"},
    {"id": "game2", "name": "Call of Duty"},
    {"id": "game3", "name": "League of Legends"},
    {"id": "game4", "name": "CS2"},
    {"id": "game5", "name": "Valorant"}
]

@ranking_bp.route('/', methods=['GET'])
def get_ranking():
    filter_type = request.args.get('filter', 'global')
    game_id = request.args.get('game_id', None)
    
    if filter_type == 'following':
        # Em uma implementação real, filtraria com base nos usuários seguidos
        filtered_players = [player for player in players_db if player['following']]
    elif filter_type == 'game' and game_id:
        # Em uma implementação real, filtraria com base no jogo
        # Aqui estamos apenas simulando
        filtered_players = players_db[:3]  # Primeiros 3 jogadores como exemplo
    else:
        # Ranking global
        filtered_players = players_db
    
    return jsonify({
        "status": "success",
        "ranking": filtered_players
    })

@ranking_bp.route('/games', methods=['GET'])
def get_games():
    return jsonify({
        "status": "success",
        "games": games_db
    })

@ranking_bp.route('/follow/<user_id>', methods=['POST'])
def follow_user(user_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    for player in players_db:
        if player['id'] == user_id:
            player['following'] = True
            return jsonify({
                "status": "success",
                "message": f"Agora você está seguindo {player['username']}"
            })
    
    return jsonify({
        "status": "error",
        "message": "Usuário não encontrado"
    }), 404

@ranking_bp.route('/unfollow/<user_id>', methods=['POST'])
def unfollow_user(user_id):
    current_user_id = session.get('user_id')
    if not current_user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    for player in players_db:
        if player['id'] == user_id:
            player['following'] = False
            return jsonify({
                "status": "success",
                "message": f"Você deixou de seguir {player['username']}"
            })
    
    return jsonify({
        "status": "error",
        "message": "Usuário não encontrado"
    }), 404
