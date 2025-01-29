// const { getDefaultConfig } = require('expo/metro-config');

// /** @type {import('expo/metro-config').MetroConfig} */
// const config = getDefaultConfig(__dirname);
// config.resolver.sourceExts.push('sql');
// module.exports = config;

/* eslint-env node */
const { getDefaultConfig } = require('expo/metro-config');

/* nativewind */
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
config.resolver.sourceExts.push('sql');

module.exports = withNativeWind(config, { input: './global.css' });
