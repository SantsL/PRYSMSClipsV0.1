from flask import Blueprint, request, jsonify, session
import json

clips_bp = Blueprint('clips', __name__, url_prefix='/api/clips')

# Simulação de banco de dados de clipes para prototipação
clips_db = [
    {
        "id": "clip1",
        "title": "Vitória épica no último segundo!",
        "user_id": "user1",
        "username": "ProGamer123",
        "game": "Fortnite",
        "views": 15420,
        "likes": 1200,
        "comments": 89,
        "category": "Destaque",
        "url": "/static/uploads/clip1.mp4",
        "thumbnail": "/static/uploads/thumb1.jpg",
        "created_at": "2025-05-20T14:30:00Z"
    },
    {
        "id": "clip2",
        "title": "Sequência de 10 kills sem morrer",
        "user_id": "user2",
        "username": "GameMaster",
        "game": "Call of Duty",
        "views": 8932,
        "likes": 754,
        "comments": 42,
        "category": "Destaque",
        "url": "/static/uploads/clip2.mp4",
        "thumbnail": "/static/uploads/thumb2.jpg",
        "created_at": "2025-05-21T10:15:00Z"
    },
    {
        "id": "clip3",
        "title": "Pentakill com Yasuo mid lane",
        "user_id": "user3",
        "username": "NinjaStreamer",
        "game": "League of Legends",
        "views": 6543,
        "likes": 520,
        "comments": 35,
        "category": "Momentos Engraçados",
        "url": "/static/uploads/clip3.mp4",
        "thumbnail": "/static/uploads/thumb3.jpg",
        "created_at": "2025-05-22T18:45:00Z"
    }
]

@clips_bp.route('/', methods=['GET'])
def get_clips():
    category = request.args.get('category', None)
    game = request.args.get('game', None)
    
    filtered_clips = clips_db
    
    if category:
        filtered_clips = [clip for clip in filtered_clips if clip['category'] == category]
    
    if game:
        filtered_clips = [clip for clip in filtered_clips if clip['game'] == game]
    
    return jsonify({
        "status": "success",
        "clips": filtered_clips
    })

@clips_bp.route('/<clip_id>', methods=['GET'])
def get_clip(clip_id):
    for clip in clips_db:
        if clip['id'] == clip_id:
            return jsonify({
                "status": "success",
                "clip": clip
            })
    
    return jsonify({
        "status": "error",
        "message": "Clipe não encontrado"
    }), 404

@clips_bp.route('/', methods=['POST'])
def create_clip():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    data = request.get_json()
    title = data.get('title')
    game = data.get('game')
    category = data.get('category')
    
    # Em uma implementação real, aqui seria feito o upload do arquivo
    # e processamento do vídeo/thumbnail
    
    new_clip = {
        "id": f"clip{len(clips_db) + 1}",
        "title": title,
        "user_id": user_id,
        "username": "Username do Usuário",  # Em uma implementação real, seria obtido do banco de dados
        "game": game,
        "views": 0,
        "likes": 0,
        "comments": 0,
        "category": category,
        "url": "/static/uploads/placeholder.mp4",
        "thumbnail": "/static/uploads/placeholder.jpg",
        "created_at": "2025-05-25T00:00:00Z"  # Em uma implementação real, seria a data atual
    }
    
    clips_db.append(new_clip)
    
    return jsonify({
        "status": "success",
        "message": "Clipe criado com sucesso",
        "clip": new_clip
    }), 201

@clips_bp.route('/<clip_id>/like', methods=['POST'])
def like_clip(clip_id):
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    for clip in clips_db:
        if clip['id'] == clip_id:
            clip['likes'] += 1
            return jsonify({
                "status": "success",
                "message": "Clipe curtido com sucesso",
                "likes": clip['likes']
            })
    
    return jsonify({
        "status": "error",
        "message": "Clipe não encontrado"
    }), 404
