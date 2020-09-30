const filterByCommonArtists = (data) => {
  let commonArrays = [];
  let flatData = data.flat();

  // compares each users songs to every other user and collects the songs by the artists they have in common
  do {
    let compare = data.shift();
    for (let user of data) {
      let compareArtists = compare.map((song) => song.artist);
      let userArtists = user.map((song) => song.artist);
      let common = compareArtists.filter((item) => userArtists.includes(item));
      commonArrays.push(common);
    }
  } while (data.length > 1);

  // filters duplicate artist names for filtration
  let commonArtists = Array.from(new Set(commonArrays.flat()));

  // filters the raw data set down to only the songs that are shared
  let filteredData = flatData.filter((song) =>
    commonArtists.includes(song.artist)
  );

  // sorts the output playlist by artist alphabetically
  let sortedData = filteredData.sort(function (a, b) {
    let artistA = a.artist.toUpperCase();
    let artistB = b.artist.toUpperCase();
    if (artistA < artistB) return -1;
    if (artistA > artistB) return 1;
    return 0;
  });

  // this bit filters the dupes that are caused by two people having the same song in their playlist
  // and also the duplicates that arise from on person having the same song twice in their playlist
  sortedData.forEach((song, i, data) => {
    for (let s of data) {
      if (data.indexOf(s) !== i && Object.values(s).indexOf(song.name) > -1) {
        data.splice(data.indexOf(s), 1);
      }
    }
  });

  console.log(sortedData);
  return sortedData;
};

const getAvgPopularityByUser = (data) => {
  //TODO: filterByCommonArtists doesn't account for if both userA and userB add the same song to their lists
  // data = filterByCommonArtists(data);
  let dataSet = [];
  let userNames = Array.from(new Set(data.map((el) => el.username)));
  for (let user of userNames) {
    let usersSongs = data.filter((song) => song.username === user);
    let usersPopularity = usersSongs
      .map((el) => el.popularity)
      .reduce((acc, val) => acc + val, 0);
    let truncate =
      Math.floor((usersPopularity / usersSongs.length) * 100) / 100;
    dataSet.push(truncate);
  }
  return [userNames, dataSet];
};

const getNumTracksByUser = (data) => {
  //TODO: filterByCommonArtists doesn't account for if both userA and userB add the same song to their lists
  let dataSet = [];
  let userNames = Array.from(new Set(data.map((el) => el.username)));
  for (let user of userNames) {
    let contributed = data.filter((song) => song.username === user);
    dataSet.push(contributed.length);
  }
  return [userNames, dataSet];
};

const getDecadesByUser = (data) => {
  //TODO: filterByCommonArtists doesn't account for if both userA and userB add the same song to their lists
  // find ratios for weighted average
  const contributedData = getNumTracksByUser(data);
  let totalTracks = contributedData[1].reduce((acc, val) => acc + val);
  let weights = [];
  for (let amount of contributedData[1]) {
    weights.push(totalTracks / amount);
  }

  let dataSet = [];
  let userNames = Array.from(new Set(data.map((el) => el.username)));
  for (let user of userNames) {
    let usersSongs = data.filter((song) => song.username === user);
    let dates = {
      "50s": 0,
      "60s": 0,
      "70s": 0,
      "80s": 0,
      "90s": 0,
      "00s": 0,
      "10s": 0,
      "20s": 0,
    };
    for (let song of usersSongs) {
      switch (true) {
        case /\d{2}2\d-\d{2}-\d{2}/.test(song.release_date):
          dates["20s"]++;
          break;
        case /\d{2}1\d-\d{2}-\d{2}/.test(song.release_date):
          dates["10s"]++;
          break;
        case /\d{2}0\d-\d{2}-\d{2}/.test(song.release_date):
          dates["00s"]++;
          break;
        case /\d{2}9\d-\d{2}-\d{2}/.test(song.release_date):
          dates["90s"]++;
          break;
        case /\d{2}8\d-\d{2}-\d{2}/.test(song.release_date):
          dates["80s"]++;
          break;
        case /\d{2}7\d-\d{2}-\d{2}/.test(song.release_date):
          dates["70s"]++;
          break;
        case /\d{2}6\d-\d{2}-\d{2}/.test(song.release_date):
          dates["60s"]++;
          break;
        case /\d{2}5\d-\d{2}-\d{2}/.test(song.release_date):
          dates["50s"]++;
          break;
        // skip songs with missing date data
        default:
          break;
      }
    }
    let userWeight = weights[userNames.indexOf(user)];
    console.log({ userWeight });
    dataSet.push(Object.values(dates).map((el) => Math.round(el * userWeight)));
  }
  return [userNames, dataSet];
};

const getNumTracksByArtist = (data, amount = 6) => {
  //TODO: filterByCommonArtists doesn't account for if both userA and userB add the same song to their lists
  let dataSet = [];
  let artists = Array.from(new Set(data.map((el) => el.artist)));
  for (let artist of artists) {
    dataSet.push(data.filter((el) => el.artist === artist).length);
  }
  let artistObject = {};
  artists.forEach((artist, index) => (artistObject[artist] = dataSet[index]));

  let sortable = [];
  for (let a in artistObject) {
    sortable.push([a, artistObject[a]]);
  }
  sortable.sort(function (a, b) {
    return b[1] - a[1];
  });
  let filteredArtists = [];
  let filteredDataSet = [];
  for (let pair of sortable) {
    filteredArtists.push(pair[0]);
    filteredDataSet.push(pair[1]);
  }
  return [filteredArtists.slice(0, amount), filteredDataSet.slice(0, amount)];
};

modules.exports = {
  getNumTracksByArtist,
  getNumTracksByUser,
  getDecadesByUser,
  getAvgPopularityByUser,
  filterByCommonArtists,
};

//this used to have a larger array of colors below in v1, not sure if its required anymore
