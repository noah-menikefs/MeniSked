const path = require('path');

module.exports = function override(config, env) {
    // Ensure the resolve.fallback property exists
    config.resolve.fallback = config.resolve.fallback || {};

    // The previous resolutions
    config.resolve.fallback["stream"] = path.resolve(__dirname, 'node_modules', 'stream-browserify');
    config.resolve.fallback["zlib"] = path.resolve(__dirname, 'node_modules', 'browserify-zlib');
    config.resolve.fallback["util"] = path.resolve(__dirname, 'node_modules', 'util');
    config.resolve.fallback["assert"] = path.resolve(__dirname, 'node_modules', 'assert');

    // Now, add the "buffer" resolution
    config.resolve.fallback["buffer"] = path.resolve(__dirname, 'node_modules', 'buffer');

    return config;
};
