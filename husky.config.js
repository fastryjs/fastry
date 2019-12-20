module.exports = {
    hooks: {
        "post-rebase": "yarn install",
        "pre-commit": "yarn lint-staged",
    },
};
