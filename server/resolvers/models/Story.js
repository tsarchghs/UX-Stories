const fileHandling = require("../../modules/fileApi");

const stories = async (root,args,context,info) => {
	if (!args.storiesInput.app) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const userId = "cjta8e79lpwxm0b79o5zw71rd";
	const createBy = await context.prisma.user({id:userId});
	const stories = await context.prisma.stories({
		where: {
			app: { id: args.storiesInput.app }
		}
	});
	return stories;
}

const createStory = async (root,args,context) => {
	if (
		!args.createStoryInput.video ||
		!args.createStoryInput.thumbnail || 
		!args.createStoryInput.versions ||
		!args.createStoryInput.categories
	){
		throw new Error("Please make sure that all of your arguments are non empty!");
	}
	const userId = "cjta8e79lpwxm0b79o5zw71rd";
	const createBy = await context.prisma.user({id:userId});
	createBy.password = null
	const video = await fileHandling.processUpload(args.createStoryInput.video.base64,
													args.createStoryInput.video.mimetype,
													context);
	const thumbnail = await fileHandling.processUpload(args.createStoryInput.thumbnail.base64,
														args.createStoryInput.thumbnail.mimetype,
														context);

	const connectAppVersions = args.createStoryInput.versions.map(x => ({id: x}));
	const connectAppCategories = args.createStoryInput.categories.map(x => ({id: x}));
	const story = await context.prisma.createStory({
		createBy: {
			connect: {
				id: createBy.id
			}
		},
		video: {
			connect: {
				id: video.id
			}
		},
		thumbnail: {
			connect: {
				id: thumbnail.id
			}
		},
		versions: {
			connect: [...connectAppVersions,]
		},
		categories: {
			connect: [...connectAppCategories]
		}
	})
	story.video = video
	story.thumbnail = thumbnail
	story.createBy = createBy
	story.categories = args.createStoryInput.categories.map(async categoryId => { return await context.prisma.storyCategory({id:categoryId}) });
	story.versions = args.createStoryInput.versions.map(async versionId => { return await context.prisma.storyCategory({id:versionId}) });
	return story
}


const storyToLibrary = async (root,args,context,info) => {
	if (!args.storyToLibraryInput.story || !args.storyToLibraryInput.library) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const library = await context.prisma.updateLibrary({
		where: { id: args.storyToLibraryInput.library },
		data: {
			stories: {
				[args.storyToLibraryInput.type]: { id:args.storyToLibraryInput.story }
			}
		}
	})
	return library;
}

const storyToApp = async (root,args,context,info) => {
	if (!args.storyToAppInput.story || !args.storyToAppInput.app) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const app = await context.prisma.updateApp({
		where: { id: args.storyToAppInput.app },
		data: {
			stories: {
				[args.storyToAppInput.type]: { id:args.storyToAppInput.story }
			}
		}
	})
	return app;
}

module.exports = {
	stories,
	createStory,
	storyToLibrary,
	storyToApp
}