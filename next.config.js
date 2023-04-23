// This file is not going through babel transformation.
// So, we write it in vanilla JS
// (But you could use ES2015 features supported by your Node.js version)

module.exports = {
  // Prefer loading of ES Modules over CommonJS
  experimental: { esmExternals: true, appDir: true },
};
