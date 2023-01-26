const natural = require("natural");

class VideoFilterService {
  filterByHash(videos, tags, search_hashtag) {
    const filter_videos_by_hashtag = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags[i].hash_tags_list.length; j++) {
        if (tags[i].hash_tags_list[j] === search_hashtag) {
          filter_videos_by_hashtag.push(
            ...videos.filter(
              (video) => video._id.toString() == tags[i].video.toString()
            )
          );
        }
      }
    }
    filter_videos_by_hashtag.reverse();
    return filter_videos_by_hashtag;
  }

  filterByTag(videos, tags, search_tag) {
    const filter_videos_by_tag = [];
    for (let i = 0; i < tags.length; i++) {
      for (let j = 0; j < tags[i].tags_list.length; j++) {
        if (
          natural.PorterStemmer.stem(
            JSON.stringify(tags[i].tags_list[j])
          ).includes(natural.PorterStemmer.stem(search_tag)) ||
          tags[i].tags_list[j] === search_tag
        ) {
          filter_videos_by_tag.push(
            ...videos.filter(
              (video) => video._id.toString() == tags[i].video.toString()
            )
          );
        }
      }
    }
    return filter_videos_by_tag;
  }

  filterByName(videos, search_string) {
    const filter_videos_by_name = videos.filter((video) =>
      natural.PorterStemmer.stem(JSON.stringify(video.video_name)).includes(
        natural.PorterStemmer.stem(search_string)
      )
    );
    filter_videos_by_name.reverse();
    return filter_videos_by_name;
  }
}

module.exports = new VideoFilterService();
