const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = new markdownIt({
    html: true
  });

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.renderInline(content);
  });

  eleventyConfig.addPassthroughCopy("src/media/");

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};