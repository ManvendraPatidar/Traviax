const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// Add resolver configuration
config.resolver.platforms = ['ios', 'android', 'native', 'web'];
config.resolver.alias = {
  '@': './src',
};

module.exports = config;
