from flask import Blueprint
from flask_socketio import emit, join_room, leave_room

def register_loadout_events(socketio):
    @socketio.on('connect')
    def handle_connect():
        emit('connection_response', {'status': 'connected'})
    
    @socketio.on('join_loadout_room')
    def handle_join_loadout_room(data):
        room = data.get('room')
        join_room(room)
        emit('room_joined', {'room': room}, room=room)
    
    @socketio.on('leave_loadout_room')
    def handle_leave_loadout_room(data):
        room = data.get('room')
        leave_room(room)
        emit('room_left', {'room': room}, room=room)
    
    @socketio.on('loadout_update')
    def handle_loadout_update(data):
        room = data.get('room')
        loadout_data = data.get('loadout')
        emit('loadout_updated', {'loadout': loadout_data}, room=room)
    
    @socketio.on('loadout_vote')
    def handle_loadout_vote(data):
        room = data.get('room')
        loadout_id = data.get('loadout_id')
        user_id = data.get('user_id')
        emit('vote_received', {
            'loadout_id': loadout_id,
            'user_id': user_id
        }, room=room)
