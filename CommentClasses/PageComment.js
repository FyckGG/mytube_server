module.exports = class PageComment {
  user_name;
  user_avatar;
  comment_text;
  comment_date;

  constructor(user_name, user_avatar, comment_text, comment_date) {
    this.user_name = user_name;
    this.user_avatar = user_avatar;
    this.comment_text = comment_text;
    this.comment_date = comment_date;
  }
};
