/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

 const { getDefaultConfig } = require("metro-config");

 module.exports = (async () => {
   const {
     resolver: { sourceExts, assetExts }
   } = await getDefaultConfig();
   return {
     transformer: {
       babelTransformerPath: require.resolve("./multi-transformer.js"),
       getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      })
     },
     resolver: {
       assetExts: assetExts.filter(ext => ext !== "svg" && ext !== "scss" && ext !== "sass"),
       sourceExts: [...sourceExts, "svg", "scss", "sass"]
     }
   };
 })();