function checkBody(input, champs) {
  let result = true;
  for (let ele of champs) {
    if (input[ele] === "" || input[ele] === undefined) {
      result = false;
    }
  }
  return result;
}

module.exports = { checkBody };
