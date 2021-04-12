const markdownIt = require("markdown-it");

module.exports = function (eleventyConfig) {
  const md = new markdownIt({
    html: true
  });

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return md.render(content);
  });

  eleventyConfig.addPassthroughCopy({"src/favicon/": "/"});
  eleventyConfig.addPassthroughCopy("src/media/");
  eleventyConfig.addPassthroughCopy("src/fonts/");
  eleventyConfig.addPassthroughCopy("src/style/");
  eleventyConfig.addPassthroughCopy("src/script/");

  return {
    dir: {
      input: "src",
      output: "dist"
    }
  };
};