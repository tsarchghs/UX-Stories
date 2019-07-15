const stripe = require('stripe')(process.env.stripe_secret_key);
const permissions = require("./permissions");

const payment = async (root,args,context) => {
    permissions.loginPermission(context, "MEMBER")
    const customer = await stripe.customers.create({
        source: args.stripe_token,
        email: context.user.email,
    });   
    let subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
            {
                plan: "plan_FPWb6aQUYgiSch",
            },
        ]
    })
    context.db.mutation.updateUser({
        where: { id: context.user.id },
        data: {
            customer_id: customer.id,
            subscription_id: subscription.id
        }
    })
    return {
        id: subscription.id,
        status: subscription.status,
        cancel_at_period_end: subscription.cancel_at_period_end
    }
}

const cancel_at_period_end = (bool) => {
    return async (root, args, context) => {
        permissions.loginPermission(context, "MEMBER");
        let subscription = await stripe.subscriptions.update(context.user.subscription_id, { cancel_at_period_end: bool });
        console.log(123123312);
        return {
            id: subscription.id,
            status: subscription.status,
            cancel_at_period_end: subscription.cancel_at_period_end
        }
    }
}

module.exports = {
    payment,
    cancelSubscription: cancel_at_period_end(true),
    renewSubscription: cancel_at_period_end(false)
}