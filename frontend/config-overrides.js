module.exports = function override(config, env) {
  console.log("React app rewired works!")
  config.resolve.fallback = {
    "https": require.resolve("https-browserify")
  };
  return config;
};