module.exports = class SubsChannel {
  channel_id;
  channel_name;
  channel_avatar;
  channel_count_of_subs;
  constructor(channel_id, channel_name, channel_avatar, channel_count_of_subs) {
    this.channel_id = channel_id;
    this.channel_name = channel_name;
    this.channel_avatar = channel_avatar;
    this.channel_count_of_subs = channel_count_of_subs;
  }
};
