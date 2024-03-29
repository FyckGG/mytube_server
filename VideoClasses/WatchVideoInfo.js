module.exports = class WatchVideoInfo {
  channel_name;
  count_subs;
  count_views;
  count_likes;
  count_dislikes;
  channel_avatar;
  video_mark;

  constructor(
    channel_name,
    count_subs,
    count_views,
    count_likes,
    count_dislikes,
    channel_avatar,
    video_mark
  ) {
    this.channel_name = channel_name;
    this.count_subs = count_subs;
    this.count_views = count_views;
    this.count_likes = count_likes;
    this.count_dislikes = count_dislikes;
    this.channel_avatar = channel_avatar;
    this.video_mark = video_mark;
  }
};
