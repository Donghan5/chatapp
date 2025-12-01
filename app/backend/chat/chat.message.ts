import { runDatabase } from "database/database";

export async function saveMessage(message: string, senderId: number, roomId: number) {
	const query = `
		INSERT INTO messages (content, sender_id, room_id)
		VALUES ($1, $2, $3)
		RETURNING *;
	`;
	const rows = await runDatabase(query, [message, senderId, roomId]);
	return rows[0];
}

// ordered by created_at desc
export async function getMessages(roomId: number) {
	const query = `
		SELECT * FROM messages
		WHERE room_id = $1
		ORDER BY created_at DESC;
	`;
	const rows = await runDatabase(query, [roomId]);
	return rows;
}