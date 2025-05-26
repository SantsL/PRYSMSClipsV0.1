from flask import Blueprint
from flask_socketio import emit, join_room, leave_room

def register_bomb_game_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        emit('connection_response', {'status': 'connected'})
    
    @socketio.on('join_bomb_room')
    def handle_join_bomb_room(data):
        room = data.get('room')
        join_room(room)
        emit('room_joined', {'room': room}, room=room)
    
    @socketio.on('leave_bomb_room')
    def handle_leave_bomb_room(data):
        room = data.get('room')
        leave_room(room)
        emit('room_left', {'room': room}, room=room)
    
    @socketio.on('bomb_game_start')
    def handle_bomb_game_start(data):
        room = data.get('room')
        sequence = data.get('sequence')
        time_limit = data.get('time_limit', 60)
        
        emit('game_started', {
            'sequence': sequence,
            'time_limit': time_limit
        }, room=room)
    
    @socketio.on('bomb_game_input')
    def handle_bomb_game_input(data):
        room = data.get('room')
        input_char = data.get('input')
        position = data.get('position')
        
        emit('input_received', {
            'input': input_char,
            'position': position
        }, room=room)
    
    @socketio.on('bomb_game_result')
    def handle_bomb_game_result(data):
        room = data.get('room')
        success = data.get('success')
        time_taken = data.get('time_taken')
        reward = data.get('reward', 0)
        
        emit('game_result', {
            'success': success,
            'time_taken': time_taken,
            'reward': reward
        }, room=room)
    
    @socketio.on('bomb_game_cooperative_hint')
    def handle_bomb_game_cooperative_hint(data):
        room = data.get('room')
        hint = data.get('hint')
        
        emit('hint_received', {
            'hint': hint
        }, room=room)
