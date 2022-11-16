module.exports = class UserVideo {
  id;
  video_name;
  video_duration;
  number_views;
  thumbnail_dir;
  //   constructor(model) {
  //     this.email = model.email;
  //     this.login = model.login;
  //     this.id = model._id;
  //     this.isActivated = model.isActivated;
  //   }
  constructor(id, video_name, video_duration, number_views, thumbnail_dir) {
    this.id = id;
    this.video_name = video_name;
    this.video_duration = video_duration;
    this.number_views = number_views;
    this.thumbnail_dir = thumbnail_dir;
  }
};
