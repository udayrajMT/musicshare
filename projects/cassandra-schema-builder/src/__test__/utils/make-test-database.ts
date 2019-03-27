import { ClientOptions, Client } from 'cassandra-driver';
import { v4 as uuid } from 'uuid';
import { DatabaseClient, IDatabaseClient } from '../../database-client';
import { CQL } from '../../cql';

const makeCassandraClient = (clientOpts: ClientOptions) => new Client(clientOpts);

export type DatabaseSeed = (database: IDatabaseClient) => Promise<void>;

export interface IMakeTestDatabaseArgs {
	seed?: DatabaseSeed;
}

export const makeTestDatabase = async ({ seed }: IMakeTestDatabaseArgs = {}) => {
	const databaseHost = process.env['CASSANDRA_HOST'] || '127.0.0.1';
	const databaseKeyspace = 'test_' + uuid().split('-').join('');
	const databaseWithoutScope = new DatabaseClient(makeCassandraClient({
		contactPoints: [databaseHost],
		localDataCenter: 'datacenter1',
	}));

	await databaseWithoutScope.execute(CQL.createKeyspace(databaseKeyspace));

	const database: IDatabaseClient = new DatabaseClient(makeCassandraClient({
		contactPoints: [databaseHost],
		localDataCenter: 'datacenter1',
		keyspace: databaseKeyspace
	}));

	if (seed) {
		await seed(database);
	}

	const cleanUp = async () => {
		try {
			await database.close();

			await databaseWithoutScope.execute(CQL.dropKeyspace(databaseKeyspace));

			await databaseWithoutScope.close();
		} catch (err) {
			console.error(err);
		}
	}

	return { database, cleanUp, databaseKeyspace };
}