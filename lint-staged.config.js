export default {
  // Only prettify files for now - skip type checking and linting to make commits fast
  "**/*.(ts|tsx|js|jsx|md|json)": filenames => `prettier --write ${filenames.join(" ")}`,
};
