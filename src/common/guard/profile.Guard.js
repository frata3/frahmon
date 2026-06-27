import UserService from "../../modules/user/user.service.js";

const ProfileGuard = async (req, res, next) => {
  try {
    const profileUser = await UserService.findOne({
      username: req.params.username,
    });
    if (!profileUser) {
      return next(new Error("User not found"));
    }
    req.profileUser = profileUser;
    req.isOwner = req.session.user && req.session.user.username === profileUser.username;
    next();
  } catch (error) {
    next(error);
  }
};

export default ProfileGuard;