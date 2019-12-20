module.exports = {
  "*.{ts,tsx,js,jsx,graphql,md}": ["yarn prettier --write", "tslint", "git add"]
};
