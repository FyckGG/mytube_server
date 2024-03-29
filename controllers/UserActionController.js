const UserActionsService = require("./../service/UserActionsService");
const UserActionService = require("./../service/UserActionsService");

class UserActionController {
  async addNewVideo(req, res, next) {
    try {
      const { userId, name, path, description, is_public, subject, duration } =
        req.body;
      const result = await UserActionService.addNewVideo(
        userId,
        name,
        path,
        description,
        is_public,
        subject,
        duration
      );
      return res.json(result);
    } catch (e) {
      res.status(400).send({ error: e });
    }
  }

  async upload_video(req, res, next) {
    try {
      if (req.file) {
        res.json({ video_name: req.file.filename });
      } else {
        throw new Error("Название видео не получено.");
      }
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async create_video_thumbnail(req, res, next) {
    try {
      const { videoId, video_dir, thumbnail_dir, thumbnail_name } = req.body;
      const result = await UserActionsService.createVideoThubnail(
        videoId,
        video_dir,
        thumbnail_dir,
        thumbnail_name
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
  async load_video_for_watch(req, res, next) {
    try {
      const { video_id, user_id } = req.body;
      const result = await UserActionService.loadVideoForWatch(
        video_id,
        user_id
      );
      if (result instanceof Error) throw new Error(result);
      res.json(result);
    } catch (e) {
      res.status(404).send({ error: e.message });
    }
  }

  async send_comment(req, res) {
    try {
      const { video_id, user_id, text } = req.body;
      const result = await UserActionService.sendComment(
        video_id,
        user_id,
        text
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async delete_comment(req, res) {
    try {
      const { comment_id } = req.body;
      const result = await UserActionService.deleteComment(comment_id);
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async subscribe(req, res) {
    try {
      const { channel_id, subscriber_id } = req.body;

      const result = await UserActionService.subscribe(
        channel_id,
        subscriber_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ erroe: e.message });
    }
  }

  async unsubscribe(req, res) {
    try {
      const { channel_id, subscriber_id } = req.body;
      const result = await UserActionService.unsubscribe(
        channel_id,
        subscriber_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async add_to_watch_later(req, res) {
    try {
      const { video_id, user_id } = req.body;
      const result = await UserActionsService.addToWatchLater(
        video_id,
        user_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async delete_watch_later(req, res) {
    try {
      const { video_id, user_id } = req.body;
      const result = await UserActionsService.deleteWatchLater(
        video_id,
        user_id
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async edit_video(req, res) {
    try {
      const { user, video_id, video_name, video_description, video_access } =
        req.body;

      const result = await UserActionService.editVideo(
        user,
        video_id,
        video_name,
        video_description,
        video_access
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async edit_tags(req, res) {
    try {
      const { user_id, video_id, tags, hash_tags } = req.body;
      const result = await UserActionService.editTags(
        user_id,
        video_id,
        tags,
        hash_tags
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async delete_video(req, res) {
    try {
      const { video_id } = req.body;
      const result = await UserActionService.deleteVideo(video_id);
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async send_complaint(req, res) {
    try {
      const { complaint_source, complaint_target, complaint_text } = req.body;
      const result = await UserActionService.sendComplaint(
        complaint_source,
        complaint_target,
        complaint_text
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }

  async send_video_complaint(req, res) {
    try {
      const { complaint_source, complaint_target, complaint_text } = req.body;
      const result = await UserActionService.sendVideoComplaint(
        complaint_source,
        complaint_target,
        complaint_text
      );
      res.json(result);
    } catch (e) {
      res.status(400).send({ error: e.message });
    }
  }
}

module.exports = new UserActionController();
