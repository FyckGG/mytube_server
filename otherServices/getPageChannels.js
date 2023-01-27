const User = require("../models/User");
const UserAvatar = require("../models/UserAvatar");
const UserStatistic = require("../models/UserStatistic");
const SubsChannel = require("../SubscriptionsClasses/SubsChannel");
const getPageChannels = async (channels) => {
  const page_channels = [];
  for (let channel of channels) {
    //const channel = await User.findById(subs_channel.channel);
    const channel_avatar = await UserAvatar.findOne({
      user: channel._id,
    });
    const channel_stats = await UserStatistic.findOne({
      user: channel._id,
    });
    const page_channel = new SubsChannel(
      channel._id,
      channel.login,
      `${channel_avatar.avatar_dir}${channel_avatar.avatar_name}`,
      channel_stats.count_of_subs
    );
    page_channels.push(page_channel);
  }
  return page_channels;
};

module.exports = getPageChannels;
