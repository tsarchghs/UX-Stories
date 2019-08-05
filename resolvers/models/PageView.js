
const pageViews = (root,args,context,info) => {
    let where = {
        pathname: args.pathname
    }
    if (args.user) where["user"] = { id: args.user }
    return context.db.query.pageViews({where},info);
}

const createPageView = (root,args,context,info) => {
    let data = { ...args };
    if (args.user){
        data["user"] = { connect: { id: args.user } }
    }
    return context.db.mutation.createPageView({data},info)
}

module.exports = {
    pageViews,
    createPageView
}