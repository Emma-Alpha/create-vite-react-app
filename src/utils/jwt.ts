import Cookie from "js-cookie";

const accessTokenKey = import.meta.env.VITE_COOKIE_NAME

export default class jwt {
  static key = accessTokenKey
  // 设定访问令牌
  static setAccessToken(token: { token_type: any; access_token: any; expires_at: number; }) {
    Cookie.set(accessTokenKey ?? "", token ? `${token.token_type} ${token.access_token}` : '', {
      expires: new Date(token.expires_at * 1000)
    });
  }

  // 获取访问令牌
  static getAccessToken(accessTokenKey: string) {
    return Cookie.get(accessTokenKey);
  }

  // 清空访问令牌
  static clearAccessToken(accessTokenKey: string) {
    Cookie.remove(accessTokenKey);
  }
}
