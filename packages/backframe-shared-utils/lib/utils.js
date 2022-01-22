function toTitleCase(name) {
  const char = name.charAt(0);
  name = name.replace(char, char.toUpperCase());

  return name;
}

function pluralize(name) {
  if (name.endsWith("s")) return name;
  else return name + "s";
}

module.exports = {
  toTitleCase,
  pluralize,
};
