// Users.
const CREATE_USER_SQL = `INSERT INTO users (id, name, email, image) values (?, ?, ?, ?)`;
const GET_USER_BY_ID_SQL = `SELECT * FROM users WHERE id = ?`;
const GET_USER_BY_EMAIL_SQL = `SELECT * FROM users WHERE email = ?`;
const GET_USER_BY_ACCOUNT_SQL = `SELECT u.*
FROM users u JOIN accounts a ON a.userId = u.id
WHERE a.providerAccountId = ? AND a.provider = ?`;
const DELETE_USER_SQL = `DELETE FROM users WHERE id = ?`;

// Accounts.
const CREATE_ACCOUNT_SQL = `INSERT INTO accounts (id, userId, type, provider, providerAccountId, refresh_token, access_token, expires_at, token_type, scope, id_token, session_state, oauth_token, oauth_token_secret) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
const GET_ACCOUNT_BY_ID_SQL = `SELECT * FROM accounts WHERE id = ?`;

export {
  CREATE_ACCOUNT_SQL,
  CREATE_USER_SQL,
  DELETE_USER_SQL,
  GET_ACCOUNT_BY_ID_SQL,
  GET_USER_BY_ACCOUNT_SQL,
  GET_USER_BY_EMAIL_SQL,
  GET_USER_BY_ID_SQL,
};
