function getUserInputs() {
  let inputs = document.querySelectorAll(".user-input");
  let arr = Array.from(inputs);
  arr = arr.filter((x) => x.value != "");
  if (arr.length < 2) {
    alert("There is an empty input. Please provide at least 2 user IDs.");
    return false;
  }
  return arr.map((el) => el.value);
}

async function apiData() {
  let userArray = getUserInputs();
  let apiCalls = [];

  try {
    userArray.forEach((user) => {
      apiCalls.push(processApiData(user));
    });
    const userDataArray = await Promise.all(apiCalls);
    for (let res of userDataArray) {
      if (res.hasOwnProperty("error")) {
        return res;
      }
    }
    return userDataArray;
  } catch (e) {
    console.error(e);
  }
}

module.exports = {
  getUserInputs,
  apiData,
};
