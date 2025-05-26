from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, login_required, current_user
import json

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')

# Simulação de banco de dados de usuários para prototipação
users_db = {
    "user1": {"username": "ProGamer123", "password": "senha123", "prysms": 1500},
    "user2": {"username": "GameMaster", "password": "senha123", "prysms": 1200},
    "user3": {"username": "NinjaStreamer", "password": "senha123", "prysms": 900},
}

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Verificação simples para prototipação
    for user_id, user_data in users_db.items():
        if user_data['username'] == username and user_data['password'] == password:
            # Simulação de login bem-sucedido
            session['user_id'] = user_id
            return jsonify({
                "status": "success",
                "message": "Login realizado com sucesso",
                "user": {
                    "id": user_id,
                    "username": user_data['username'],
                    "prysms": user_data['prysms']
                }
            })
    
    return jsonify({
        "status": "error",
        "message": "Credenciais inválidas"
    }), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    return jsonify({
        "status": "success",
        "message": "Logout realizado com sucesso"
    })

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    # Verificar se o usuário já existe
    for user_data in users_db.values():
        if user_data['username'] == username:
            return jsonify({
                "status": "error",
                "message": "Nome de usuário já existe"
            }), 400
    
    # Criar novo usuário
    new_user_id = f"user{len(users_db) + 1}"
    users_db[new_user_id] = {
        "username": username,
        "password": password,
        "prysms": 100  # Prysms iniciais para novos usuários
    }
    
    return jsonify({
        "status": "success",
        "message": "Usuário registrado com sucesso",
        "user": {
            "id": new_user_id,
            "username": username,
            "prysms": 100
        }
    }), 201

@auth_bp.route('/profile', methods=['GET'])
def profile():
    user_id = session.get('user_id')
    if not user_id or user_id not in users_db:
        return jsonify({
            "status": "error",
            "message": "Usuário não autenticado"
        }), 401
    
    user_data = users_db[user_id]
    return jsonify({
        "status": "success",
        "user": {
            "id": user_id,
            "username": user_data['username'],
            "prysms": user_data['prysms']
        }
    })
