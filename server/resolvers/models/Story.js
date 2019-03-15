const fileHandling = require("../../modules/fileApi");

const stories = async (root,args,context) => {
	if (!args.storiesInput.app) {
		throw new Error("Please check that all of your arguments are not empty!")
	}
	const userId = "cjtabbnzyqlww0b79zgo8k7ku";
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
		!args.createStoryInput.app || 
		!args.createStoryInput.video ||
		!args.createStoryInput.thumbnail || 
		!args.createStoryInput.versions ||
		!args.createStoryInput.categories
	){
		throw new Error("Please make sure that all of your arguments are non empty!");
	}
	const userId = "cjtabbnzyqlww0b79zgo8k7ku";
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
		app: {
			connect: {
				id: args.createStoryInput.app
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
	await context.prisma.updateFile({
		where: { id: thumbnail.id },
		data: {
			stories: {
				connect: { id: story.id }
			}
		}
	})
	await context.prisma.updateFile({
		where: { id: video.id },
		data: {
			stories: {
				connect: { id: story.id }
			}
		}
	})
	// story.video = video
	// story.thumbnail = thumbnail
	// story.createBy = createBy
	// story.categories = args.createStoryInput.categories.map(async categoryId => { return await context.prisma.storyCategory({id:categoryId}) });
	// story.versions = args.createStoryInput.versions.map(async versionId => { return await context.prisma.storyCategory({id:versionId}) });
	return story
}


const storyToLibrary = async (root,args,context) => {
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

const storyToApp = async (root,args,context) => {
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

const video = async (parent,args,context) => {
	const video = await context.prisma.files({
		where: {
			stories_some: {
				id: parent.id
			},
			mimetype_contains:"video"
		}
	})
	return video[0];
}

const elements = async (parent,args,context) => {
	const storyElements = await context.prisma.storyElements({
		where: {
			stories_some: {
				id: parent.id
			}
		}
	})
	return storyElements
}

const categories = async (parent,args,context) => {
	const storyCategories = await context.prisma.storyCategories({
		where:{
			stories_some:{
				id: parent.id
			}
		}
	})
	return storyCategories
}

const versions = async (parent,args,context) => {
	const appVersions = await context.prisma.appVersions({
		where:{
			stories_some: {
				id: parent.id
			}
		}
	})
	return appVersions
}

const thumbnail = async (parent,args,context) => {
	const thumbnail = await context.prisma.files({
		where: {
			stories_some: {
				id: parent.id
			},
			mimetype_contains:"image"
		}
	})
	return thumbnail[0];
}

const app = async (parent,args,context) => {
	const app = await context.prisma.apps({
		where:{
			stories_some:{
				id: parent.id
			}
		}
	})
	return app[0];
}

module.exports = {
	stories,
	createStory,
	storyToLibrary,
	storyToApp,
	video,
	elements,
	categories,
	versions,
	thumbnail,
	app
}