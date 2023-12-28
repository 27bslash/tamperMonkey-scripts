song_list = [
  "Don Johnson  Heartbeat ",
  "Out of Touch- Hall and Oates",
  "Dance Hall Days- Wang Chung",
  "Billie Jean- Michael Jackson",
  "Self Control- Laura Branigan",
];
const PLAYLISTID = "PLcopmgv8H5rs-QJ_592CZhG7z64GDIZDx";
var GoogleAuth; // Google Auth object.
async function search_youtube() {
  for (let song of song_list) {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?q=${song}&key=AIzaSyDqbbNWg8UvxmArv1O-ZV233XfnxyHgrqo`
    );
    console.log(
      `https://www.googleapis.com/youtube/v3/search?q=${song}&key=AIzaSyDqbbNWg8UvxmArv1O-ZV233XfnxyHgrqo`
    );
    json = await res.json();
    const video_id = json.items[0].id.videoId;
    execute(video_id);
  }
}

video_ids = [];
async function playlist_items(pageToken) {
  let response = await gapi.client.youtube.playlistItems.list({
    part: "snippet",
    playlistId: PLAYLISTID,
    maxResults: 50,
    pageToken: pageToken,
  });
  next_page = response.result.nextPageToken;
  data = response.result.items;
  data.forEach((x) => {
    video_ids.push(x.snippet.resourceId.videoId);
  });
  if (next_page) {
    playlist_items(next_page);
  }
}
async function execute(videoId) {
  await playlist_items(null);
  if (video_ids.indexOf(videoId) !== -1) {
    console.log("vid in ");
    return;
  }
  return gapi.client.youtube.playlistItems
    .insert({
      part: "snippet",
      resource: {
        snippet: {
          playlistId: PLAYLISTID,
          resourceId: {
            videoId: videoId,
            kind: "youtube#video",
          },
        },
      },
    })
    .then(
      function (response) {
        // Handle the results here (response.result has the parsed body).
        console.log("Response", response.status);
      },
      function (err) {
        console.error("Execute error", err);
      }
    );
}
// create_playlist();
// insert_to_playlist("test");
// authenticate()
// loadClient()
// execute()
