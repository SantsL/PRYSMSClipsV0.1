import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))  # DON'T CHANGE THIS !!!

from flask import Flask, render_template, jsonify, request, redirect, url_for
from flask_socketio import SocketIO
from flask_login import LoginManager, current_user, login_user, logout_user, login_required
import json

app = Flask(__name__, 
            static_folder='static',
            template_folder='templates')

app.config['SECRET_KEY'] = 'prysmsclips-secret-key'
app.config['UPLOAD_FOLDER'] = os.path.join(app.static_folder, 'uploads')

# Configuração do Socket.IO para minigames em tempo real
socketio = SocketIO(app, cors_allowed_origins="*")

# Configuração do Login Manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'auth.login'

# Importação de rotas
from src.routes.auth import auth_bp
from src.routes.clips import clips_bp
from src.routes.ranking import ranking_bp
from src.routes.loadout import loadout_bp
from src.routes.bomb_game import bomb_game_bp

# Registro de blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(clips_bp)
app.register_blueprint(ranking_bp)
app.register_blueprint(loadout_bp)
app.register_blueprint(bomb_game_bp)

@app.route('/')
def index():
    return jsonify({
        "status": "success",
        "message": "PRYSMSCLIPS API está funcionando!",
        "endpoints": {
            "auth": "/api/auth",
            "clips": "/api/clips",
            "ranking": "/api/ranking",
            "loadout": "/api/loadout",
            "bomb_game": "/api/bomb_game"
        }
    })

# Importação de eventos Socket.IO
from src.socket.loadout import register_loadout_events
from src.socket.bomb_game import register_bomb_game_events

# Registro de eventos Socket.IO
register_loadout_events(socketio)
register_bomb_game_events(socketio)

if __name__ == '__main__':
    # Certifique-se de que o diretório de uploads existe
    os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
    
    # Inicie o servidor
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
