class ApiRoutes {
  static AUTH = {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
  };
  static POST = {
    GET: "/post/all",
    CREATE: "/post/create",
    DELETE: "/post/delete",
  };
  static LIKE = {
    TOGGLE: "/like/like",
  };
  static COMMENT = {
    GET: "/comment/get_for_post",
    CREATE: "/comment/create",
    DELETE: "/comment/delete",
  };
}
export default ApiRoutes;
