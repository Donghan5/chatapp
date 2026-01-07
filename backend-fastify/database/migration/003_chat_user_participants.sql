CREATE TABLE IF NOT EXISTS room_participants (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id INTEGER NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (user_id, room_id) 
);

CREATE INDEX idx_room_participants_room_id ON room_participants(room_id);