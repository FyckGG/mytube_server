const Video = require("./../models/Video");
const Users = require("./../models/User");
const VideoTags = require("./../models/VideoTags");
const VideoFilterService = require("./VideoFilterService");
const ChannelFilterService = require("./ChannelFilterService");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

class searchService {
  async getSearchResults(search_string) {
    const string_tokens = tokenizer.tokenize(search_string);

    const videos = await Video.find();
    const channels = await Users.find();
    const tags = await VideoTags.find();
    if (search_string[0] === "#") {
      const filter_videos_by_hashtag = VideoFilterService.filterByHash(
        videos,
        tags,
        search_string
      );
      return { videos: filter_videos_by_hashtag, channels: [] };
    } //////////////////////////////////////////////////////////////////////////////

    const filter_videos_by_search_string = VideoFilterService.filterByName(
      videos,
      search_string
    );

    const filter_videos_by_tokens = [];
    const filter_channels_by_tokens = [];
    const filter_videos_by_tags = [];
    string_tokens.map((token) => {
      const filter_videos_by_token = VideoFilterService.filterByName(
        videos,
        token
      );
      const filter_videos_by_tag = VideoFilterService.filterByTag(
        videos,
        tags,
        token
      );
      const filter_channels_by_token = ChannelFilterService.filterByName(
        channels,
        token
      );

      filter_videos_by_tokens.push(...filter_videos_by_token);
      filter_videos_by_tags.push(...filter_videos_by_tag);
      filter_channels_by_tokens.push(...filter_channels_by_token);
    });

    const filter_channels_by_search_string = ChannelFilterService.filterByName(
      channels,
      search_string
    );

    const filter_videos = [];
    const filter_channels = [];
    filter_videos.push(
      ...filter_videos_by_search_string,
      ...filter_videos_by_tokens,
      ...filter_videos_by_tags
    );
    filter_channels.push(
      ...filter_channels_by_search_string,
      ...filter_channels_by_tokens
    );

    return {
      videos: [...new Set(filter_videos)],
      channels: [...new Set(filter_channels)],
    };
  }
}

module.exports = new searchService();
