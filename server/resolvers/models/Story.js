const fileHandling = require("../../modules/fileApi");

const createStory = async (root,args,context) => {
	if (
		!args.createStoryInput.video ||
		!args.createStoryInput.thumbnail || 
		!args.createStoryInput.versions ||
		!args.createStoryInput.categories
	){
		throw new Error("Please make sure that all of your arguments are non empty!");
	}
	const userId = "cjsxdc4kg35h90b3039qediof";
	const createBy = await context.prisma.user({id:userId});
	const video = await fileHandling.processUpload(args.createStoryInput.video,context);
	const thumbnail = await fileHandling.processUpload(args.createStoryInput.thumbnail,context);

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
	return story
}

module.exports = {
	createStory
}