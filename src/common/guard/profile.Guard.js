import UserService from "../../modules/user/user.service.js";
export default async function profileGuard(req, res, next) {
  try {
    const profile = await UserService.findOne({
      username: req.params.username,
    });

    if (!profile) {
      return next(new Error("User not found"));
    }
    req.profile = profile;
    req.isOwner = req.user?._id.toString() === profile._id.toString();
    next();
  } catch (error) {
    next(error);
  }
}