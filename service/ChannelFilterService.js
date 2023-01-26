const natural = require("natural");

class ChannelFilterService {
  filterByName(channels, search_string) {
    const filter_channels_by_name = channels.filter((channel) =>
      natural.PorterStemmer.stem(JSON.stringify(channel.login)).includes(
        natural.PorterStemmer.stem(search_string)
      )
    );
    return filter_channels_by_name;
  }
}

module.exports = new ChannelFilterService();
