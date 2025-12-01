import { runDatabase } from "../database/database";

export async function unreadCount(userId: number, roomId: number): Promise<number> {
    const query = `
        SELECT COUNT(*)::int as count
        FROM messages m
        JOIN room_participants rp ON m.room_id = rp.room_id
        WHERE m.room_id = $1 
          AND rp.user_id = $2
          AND m.created_at > rp.last_read_at;
    `;
    const params = [roomId, userId];
    const rows = await runDatabase(query, params);
    
    return Number(rows[0]?.count || 0);
}

export async function updateLastReadAt(userId: number, roomId: number): Promise<void> {
    const query = `
        UPDATE room_participants
        SET last_read_at = CURRENT_TIMESTAMP
        WHERE room_id = $1 AND user_id = $2;
    `;
    const params = [roomId, userId];
    await runDatabase(query, params);
}