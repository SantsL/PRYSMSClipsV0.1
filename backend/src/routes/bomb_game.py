from flask import Blueprint, request, jsonify, session
import json
import random

bomb_game_bp = Blueprint('bomb_game', __name__, url_prefix='/api/bomb_game')

# Simulação de banco de dados de salas de jogo
rooms_db = [
    {
        "id": "room1",
        "name": "Sala #1",
        "category": "Tecnologia",
        "players": 8,
        "max_players": 16,
        "status": "Em andamento"
    },
    {
        "id": "room2",
        "name": "Sala #2",
        "category": "Jogos",
        "players": 12,
        "max_players": 16,
        "status": "Em andamento"
    },
    {
        "id": "room3",
        "name": "Sala #3",
        "category": "Filmes",
        "players": 5,
        "max_players": 16,
        "status": "Em andamento"
    }
]

# Simulação de banco de dados de sequências para o jogo
sequences_db = [
    "SEEWQWA",
    "AQWERTY",
    "ZXCVBNM",
    "QAZWSXE",
    "EDCRFVT"
]

@bomb_game_bp.route('/rooms', methods=['GET'])
def get_rooms():
    return jsonify({
        "status": "success",
        "rooms": rooms_db
    })

@bomb_game_bp.route('/rooms', methods=['POST'])
def create_room():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    data = request.get_json()
    name = data.get('name', f"Sala #{len(rooms_db) + 1}")
    category = data.get('category', "Geral")
    max_players = data.get('max_players', 16)
    
    new_room = {
        "id": f"room{len(rooms_db) + 1}",
        "name": name,
        "category": category,
        "players": 1,  # Inicialmente apenas o criador
        "max_players": max_players,
        "status": "Aguardando"
    }
    
    rooms_db.append(new_room)
    
    return jsonify({
        "status": "success",
        "message": "Sala criada com sucesso",
        "room": new_room
    }), 201

@bomb_game_bp.route('/rooms/<room_id>/join', methods=['POST'])
def join_room(room_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    for room in rooms_db:
        if room['id'] == room_id:
            if room['players'] >= room['max_players']:
                return jsonify({
                    "status": "error",
                    "message": "Sala cheia"
                }), 400
            
            room['players'] += 1
            return jsonify({
                "status": "success",
                "message": "Entrou na sala com sucesso",
                "room": room
            })
    
    return jsonify({
        "status": "error",
        "message": "Sala não encontrada"
    }), 404

@bomb_game_bp.route('/sequence', methods=['GET'])
def get_sequence():
    # Retorna uma sequência aleatória para o jogo
    sequence = random.choice(sequences_db)
    
    return jsonify({
        "status": "success",
        "sequence": sequence,
        "time_limit": 60  # Tempo limite em segundos
    })

@bomb_game_bp.route('/verify', methods=['POST'])
def verify_sequence():
    data = request.get_json()
    input_sequence = data.get('sequence', '')
    expected_sequence = data.get('expected_sequence', '')
    time_taken = data.get('time_taken', 0)
    
    if input_sequence == expected_sequence:
        # Calcular recompensa com base no tempo
        reward = max(10, 100 - int(time_taken))
        
        return jsonify({
            "status": "success",
            "message": "Bomba desarmada com sucesso!",
            "success": True,
            "reward": reward,
            "time_taken": time_taken
        })
    else:
        return jsonify({
            "status": "success",
            "message": "Falha ao desarmar a bomba!",
            "success": False,
            "reward": 0,
            "time_taken": time_taken
        })
