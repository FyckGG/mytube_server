const VideoStatistic = require("./../models/VideoStatistic");
const VideoComment = require("./../models/VideoComment");

class DataLoadService {
  async loadComments(video_id) {
    const video_stats = await VideoStatistic.findOne({ video: video_id });
    const commentList = await VideoComment.find({
      video_stat: video_stats._id,
    });
    const comments_count = video_stats.count_of_comments;
    return { comments_count: comments_count, comment_list: commentList };
  }
}

module.exports = new DataLoadService();
