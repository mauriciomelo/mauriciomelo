import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [
    "../@(app|page|components)/**/*.mdx",
    "../@(app|page|components)/**/*.stories.@(js|jsx|ts|tsx)",
  ],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: "@storybook/nextjs",
  staticDirs: ["../public"],
  docs: {
    autodocs: true,
  },
};

export default config;
