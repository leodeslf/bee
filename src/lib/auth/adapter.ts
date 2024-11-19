import type { D1Database as WorkerDatabase } from "@cloudflare/workers-types";
import type { D1Database as MiniflareD1Database } from "@miniflare/d1";
import {
  isDate,
  type Adapter,
  type AdapterAccount,
  type AdapterUser,
} from "@auth/core/adapters";
import {
  CREATE_ACCOUNT_SQL,
  CREATE_USER_SQL,
  DELETE_USER_SQL,
  GET_ACCOUNT_BY_ID_SQL,
  GET_USER_BY_ACCOUNT_SQL,
  GET_USER_BY_EMAIL_SQL,
  GET_USER_BY_ID_SQL,
} from "./queries";

export type D1Database = WorkerDatabase | MiniflareD1Database;

function format<T>(obj: Record<string, any>): T {
  for (const [key, value] of Object.entries(obj)) {
    if (value === null) {
      delete obj[key];
    }

    if (isDate(value)) {
      obj[key] = new Date(value);
    }
  }

  return obj as T;
}

function cleanBindings(bindings: any[]) {
  return bindings.map((e) => (e === undefined ? null : e));
}

export async function getRecord<RecordType>(
  db: D1Database,
  SQL: string,
  bindings: any[]
): Promise<RecordType | null> {
  try {
    bindings = cleanBindings(bindings);
    const res: any = await db
      .prepare(SQL)
      .bind(...bindings)
      .first();

    if (res) {
      return format<RecordType>(res);
    } else {
      return null;
    }
  } catch (e: any) {
    console.error(e.message, e.cause?.message);
    throw e;
  }
}

export async function createRecord<RecordType>(
  db: D1Database,
  CREATE_SQL: string,
  bindings: any[],
  GET_SQL: string,
  getBindings: any[]
) {
  try {
    bindings = cleanBindings(bindings);
    await db
      .prepare(CREATE_SQL)
      .bind(...bindings)
      .run();
    return await getRecord<RecordType>(db, GET_SQL, getBindings);
  } catch (e: any) {
    console.error(e.message, e.cause?.message);
    throw e;
  }
}

export async function updateRecord(
  db: D1Database,
  SQL: string,
  bindings: any[]
) {
  try {
    bindings = cleanBindings(bindings);
    return await db
      .prepare(SQL)
      .bind(...bindings)
      .run();
  } catch (e: any) {
    console.error(e.message, e.cause?.message);
    throw e;
  }
}

export async function deleteRecord(
  db: D1Database,
  SQL: string,
  bindings: any[]
) {
  try {
    bindings = cleanBindings(bindings);
    await db
      .prepare(SQL)
      .bind(...bindings)
      .run();
  } catch (e: any) {
    console.error(e.message, e.cause?.message);
    throw e;
  }
}

// A minimal OAuth, cookie-based, provider-only adapter.
export function BeeD1Adapter(db: D1Database): Adapter {
  return {
    async createUser(user) {
      const id = crypto.randomUUID();
      const bindingsToCreate = [
        id,
        user.name,
        user.email,
        user.image,
      ];
      const bindingsToGet = [id];
      const newUser = await createRecord<AdapterUser>(
        db,
        CREATE_USER_SQL,
        bindingsToCreate,
        GET_USER_BY_ID_SQL,
        bindingsToGet,
      );

      if (newUser) {
        return newUser;
      }

      throw new Error("Failed while creating a new user.");
    },
    async getUser(id) {
      return await getRecord<AdapterUser>(db, GET_USER_BY_ID_SQL, [id]);
    },
    async getUserByEmail(email) {
      return await getRecord<AdapterUser>(db, GET_USER_BY_EMAIL_SQL, [email]);
    },
    async getUserByAccount({ provider, providerAccountId }) {
      return await getRecord<AdapterUser>(
        db,
        GET_USER_BY_ACCOUNT_SQL,
        [
          providerAccountId,
          provider,
        ]
      );
    },
    async deleteUser(id) {
      return void await deleteRecord(db, DELETE_USER_SQL, [id]);
    },
    async linkAccount(account) {
      const id = crypto.randomUUID();
      const createBindings = [
        id,
        account.userId, // Camel required by Auth.js' internals.
        account.type,
        account.provider,
        account.providerAccountId, // Camel required by Auth.js' internals.
        account.refresh_token,
        account.access_token,
        account.expires_at,
        account.token_type,
        account.scope,
        account.id_token,
        account.session_state,
        account.oauth_token,
        account.oauth_token_secret,
      ];
      const getBindings = [id];
      return await createRecord<AdapterAccount>(
        db,
        CREATE_ACCOUNT_SQL,
        createBindings,
        GET_ACCOUNT_BY_ID_SQL,
        getBindings,
      );
    },
  };
}
