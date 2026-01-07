import { runDatabase, runTransaction } from '../database/database';
import { PoolClient } from 'pg';
import { updateLastReadAt, unreadCount } from './chat.utils'; 

export interface ChatRoom {
    id: number;
    name: string;
    lastMessage?: string;
    updatedAt: Date;
    unreadCount: number;
}

export async function createChatRoom(roomName: string, creatorId: number) {
    return runTransaction(async (client) => {
        const query = `
            INSERT INTO chat_rooms (name, created_by)
            VALUES ($1, $2)
            RETURNING *;
        `;
        const rows = await runDatabase(query, [roomName, creatorId], client);
        const room = rows[0];

        await joinChatRoom(creatorId, room.id, client);

        return room;
    });
}

export async function getChatRooms(userId: number) {
    const query = `
        SELECT 
            r.id, 
            r.name, 
            r.updated_at,
            (
                SELECT content 
                FROM messages m 
                WHERE m.room_id = r.id 
                ORDER BY m.created_at DESC 
                LIMIT 1
            ) as last_message,
            (
                SELECT COUNT(*)::int 
                FROM messages m 
                WHERE m.room_id = r.id 
                  AND m.created_at > rp.last_read_at
            ) as unread_count
        FROM chat_rooms r
        JOIN room_participants rp ON r.id = rp.room_id
        WHERE rp.user_id = $1
        ORDER BY r.updated_at DESC;
    `;

    const rows = await runDatabase(query, [userId]);
    
    return rows.map((row: any) => ({
        id: row.id,
        name: row.name,
        lastMessage: row.last_message || '',
        updatedAt: row.updated_at,
        unreadCount: row.unread_count || 0
    }));
}

export async function joinChatRoom(userId: number, roomId: number, client?: PoolClient) {
    const query = `
        INSERT INTO room_participants (user_id, room_id, last_read_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (user_id, room_id) DO NOTHING;
    `;
    await runDatabase(query, [userId, roomId], client);
}

export async function leaveChatRoom(userId: number, roomId: number, client?: PoolClient) {
    const query = `
        DELETE FROM room_participants
        WHERE user_id = $1 AND room_id = $2;
    `;
    await runDatabase(query, [userId, roomId], client);
}

export async function enterChatRoom(userId: number, roomId: number, client?: PoolClient) {
    await updateLastReadAt(userId, roomId);
    
    return {
        unread: 0, 
        updatedAt: new Date()
    };
}