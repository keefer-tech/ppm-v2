// takes a user id and playlist name and returns the playlist id
// optional: limit and offset if target playlist is deeper in list
const getPlaylistId = async (
  userId,
  authToken,
  playlistName = "publicLiked",
  limit = 50,
  offset = 0
) => {
  let endpointUrl = `https://api.spotify.com/v1/users/${userId}/playlists?limit=${limit}&offset=${offset}`;

  try {
    let raw = await axios({
      url: endpointUrl,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    });

    if (!raw.status === 200) {
      return {
        error: "No Playlist",
        msg: `Could not locate playlist for user: ${userId}.`,
      };
    }
    let res = raw.data;

    let playlistEndpoint;
    for (playlist of res.items) {
      playlist.name === playlistName
        ? (playlistEndpoint = playlist.tracks.href)
        : "";
    }
    return playlistEndpoint;
  } catch (e) {
    console.error(e);
  }
};

// This functions gets all the tracks from a playlist and returns them in a array
const getPlaylistItems = async (endpointUrl, authToken) => {
  if (endpointUrl.hasOwnProperty("error")) {
    return endpointUrl;
  }

  let allItems = [];
  while (true) {
    try {
      let raw = await axios({
        url: endpointUrl,
        method: "get",
        headers: {
          Authorization: authToken,
        },
      });
      if (!raw.status === 200) {
        return {
          error: "Lost Playlist",
          msg: `Located playlist for user: ${userId}, but something went wrong.`,
        };
      }
      let res = await raw.data;
      endpointUrl = res.next;
      let newItems = res.items;
      allItems = allItems.concat(newItems);
      if (res.next === null) {
        break;
      }
    } catch (e) {
      // console.error({ e });
      break;
    }
  }
  return allItems;
};

const getDisplayName = async (userId, authToken) => {
  let endpointUrl = `https://api.spotify.com/v1/users/${userId}`;

  try {
    let raw = await axios({
      url: endpointUrl,
      method: "get",
      headers: {
        Authorization: authToken,
      },
    });
    if (!raw.status === 200) {
      return { error: "No User", msg: `Could not locate user: ${userId}.` };
    }
    let res = await raw.json();

    return res.display_name;
  } catch (e) {
    console.error(e);
  }
};

// this processes the data down to a useable object
const processApiData = async (userId, authToken) => {
  try {
    let displayName = await getDisplayName(userId, authToken);
    let playlistUrl = await getPlaylistId(userId, authToken);
    let playlistItems = await getPlaylistItems(playlistUrl, authToken);

    for (let res of [displayName, playlistUrl, playlistItems]) {
      if (res.hasOwnProperty("error")) {
        console.log({ res });
        return res;
      }
    }

    let tracks = [];

    playlistItems.forEach((t) => {
      track = {
        name: t.track.name,
        artist: t.track.artists[0].name,
        album: t.track.album.name,
        release_date: t.track.album.release_date,
        popularity: t.track.popularity,
        link: t.track.external_urls.spotify,
        id: t.track.id,
        from_user: t.added_by.id,
        username: displayName,
      };
      tracks.push(track);
    });
    console.log({ tracks });
    return tracks;
  } catch (e) {
    return {
      error: "No Tracks",
      msg: `Error: Did not receive track data from at least 1 user. Please ensure all User ID's are correct and that the 'publicLiked' playlists contain track data.`,
    };
  }
};

module.exports = { processApiData };
