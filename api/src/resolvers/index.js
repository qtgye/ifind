const { getBestSellers } = require('@sources/amazon');

module.exports = {
    Query: {
        bestSellers: async (parent, args) => {
            return await getBestSellers(args.category);
        },
    },
};