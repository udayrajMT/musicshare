import { makeTestDatabase } from "./make-test-database";
import { SongService } from "../../services/SongService";
import { UserService } from "../../services/UserService";
import { ShareService } from "../../services/ShareService";
import Container from "typedi";
import { makeGraphQLServer } from "../../server/GraphQLServer";
import { ShareResolver } from "../../resolvers/ShareResolver";
import { SongResolver } from "../../resolvers/SongResolver";
import { UserResolver } from "../../resolvers/UserResolver";
import { FileServiceMock } from "../mocks/FileServiceMock";
import { ISongMetaDataService } from "../../utils/song-meta/SongMetaDataService";
import { SongUploadProcessingQueue } from "../../job-queues/SongUploadProcessingQueue";

interface SetupTestEnvArgs {
	seedDatabase?: boolean;
	startServer?: boolean;
}

export const setupTestEnv = async ({ seedDatabase, startServer }: SetupTestEnvArgs = { seedDatabase: true, startServer: true }) => {
	const { database, cleanUp, seed } = await makeTestDatabase();

	const songService = new SongService(database);
	const userService = new UserService(database);
	const shareService = new ShareService(database);
	const fileService = new FileServiceMock(() => undefined, () => 'http://someurl.de/file.mp3');
	const songMetaDataService: ISongMetaDataService = { analyse: async () => ({}) };
	const songUploadProcessingQueue = new SongUploadProcessingQueue(songService, fileService, songMetaDataService);

	Container.set('USER_SERVICE', userService);
	Container.set('SHARE_SERVICE', shareService);
	Container.set('SONG_SERVICE', songService);
	Container.set('FILE_SERVICE', fileService);

	if (seedDatabase === true) {
		await seed(songService);
	}

	const graphQLServer = await makeGraphQLServer(Container, UserResolver, ShareResolver, SongResolver);

	if (startServer === true) {
		await graphQLServer.createHttpServer({});
	}

	return { graphQLServer, database, cleanUp, fileService, shareService, userService, songService, songUploadProcessingQueue };
}