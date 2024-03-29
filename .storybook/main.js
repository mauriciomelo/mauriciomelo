const path = require("path");
const toPath = (filePath) => path.join(process.cwd(), filePath);
module.exports = {
  stories: [
    "../@(app|page|components)/**/*.mdx",
    "../@(app|page|components)/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-mdx-gfm",
    "@storybook/addon-styling",
  ],
  // webpackFinal: async config => {
  //   return {
  //     ...config,
  //     resolve: {
  //       ...config.resolve,
  //       alias: {
  //         ...config.resolve.alias,
  //         "@emotion/core": toPath("node_modules/@emotion/react"),
  //         "emotion-theming": toPath("node_modules/@emotion/react")
  //       }
  //     }
  //   };
  // },
  framework: {
    name: "@storybook/nextjs",
    options: {
      fastRefresh: true,
      strictMode: true,
    },
  },
  staticDirs: ["../public"],
  docs: {
    autodocs: true,
  },
};
