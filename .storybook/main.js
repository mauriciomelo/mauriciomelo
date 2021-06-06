module.exports = {
  stories: [
    "../@(page|components)/**/*.stories.mdx",
    "../@(page|components)/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
};
