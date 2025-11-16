CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
	NEW.updated_at = CURRENT_TIMESTAMP;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. 'users' 테이블에 트리거 적용
CREATE TRIGGER set_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();

-- 3. 'chat_rooms' 테이블에 트리거 적용
CREATE TRIGGER set_chat_rooms_updated_at
BEFORE UPDATE ON chat_rooms
FOR EACH ROW
EXECUTE PROCEDURE set_updated_at();