import { runDatabase } from '../database/database';

export interface Message {
    id: number;
    roomId: number;
    senderId: number;
    content: string;
    createdAt: Date;
}

export async function saveMessage(roomId: number, senderId: number, content: string): Promise<Message> {
    const query = `
        INSERT INTO messages (room_id, sender_id, content)
        VALUES ($1, $2, $3)
        RETURNING id, room_id as "roomId", sender_id as "senderId", content, created_at as "createdAt";
    `;
    const rows = await runDatabase(query, [roomId, senderId, content]);
    return rows[0];
}

export async function getMessages(roomId: number, limit = 50): Promise<Message[]> {
    const query = `
        SELECT * FROM (
            SELECT 
                id, 
                room_id as "roomId", 
                sender_id as "senderId", 
                content, 
                created_at as "createdAt"
            FROM messages
            WHERE room_id = $1
            ORDER BY created_at DESC
            LIMIT $2
        ) sub
        ORDER BY "createdAt" ASC;
    `;
    const rows = await runDatabase(query, [roomId, limit]);
    return rows;
}