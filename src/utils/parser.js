const { parse } = require("url");

const restrictSize = size => {
  const number = parseInt(size);

  if (isNaN(number)) {
    return size;
  } else if (number < 10) {
    return 10;
  } else if (number > 1000) {
    return 1000;
  }
  return number;
};

const toArrayIfTruthy = str => {
  return str ? str.split(",").filter(i => i) : str;
};

const parseQuery = req => {
  const { query = {} } = parse(req.url || "", true);
  let { size, background } = query;
  type = toArrayIfTruthy(type);
  mood = toArrayIfTruthy(mood);
  color = toArrayIfTruthy(color);

  return {
    size: restrictSize(size) || 300,
    background: background || "#ffffff"
  };
};

module.exports = {
  parseQuery
};
