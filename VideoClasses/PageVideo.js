module.exports = class PageVideo {
  video_id;
  video_name;
  video_preview;
  channel_id;
  channel_name;
  channel_avatar;
  count_views;
  video_duration;
  video_date;
  is_watch_later;
  constructor(
    video_id,
    video_name,
    video_preview,
    channel_id,
    channel_name,
    channel_avatar,
    count_views,
    video_duration,
    video_date,
    is_watch_later
  ) {
    this.video_id = video_id;
    this.video_name = video_name;
    this.video_preview = video_preview;
    this.channel_id = channel_id;
    this.channel_name = channel_name;
    this.channel_avatar = channel_avatar;
    this.count_views = count_views;
    this.video_duration = video_duration;
    this.video_date = video_date;
    this.is_watch_later = is_watch_later;
  }
};
