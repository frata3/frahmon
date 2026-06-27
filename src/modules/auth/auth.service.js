import autoBind from 'auto-bind';
import UserService from '../user/user.service.js';
import bcrypt from 'bcrypt';
class AuthService {
  #userService;
  constructor() {
    autoBind(this);
    this.#userService = UserService;
  }
  async findUserByEmail(email) {
    return !!(await this.#userService
      .findOne({ email: email.toLowerCase() })
      .lean());
  }
  async createUser(userData) {
    const existingUser = await this.#userService.findOne({ email: userData.email }).lean();
    if (existingUser) {
      const error = new Error("Email already registered");
      error.statusCode = 409;
      error.code = "email conflict";
      throw error;
    }
  
    const user = await this.#userService.create(userData);
    return user;
  }
  
  async authenticate({ email, password }) {
      const user = await this.#userService.findOne({ email: email.toLowerCase() }).lean();
      if (!user) {
        throw new Error("Invalid email or password");
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }
      return {
        _id: user._id,
        email: user.email,
        fullname: user.fullname,
        username: user.username,
        avatar: user.avatar,
        role: user.role
      };
  }
}

export default new AuthService();