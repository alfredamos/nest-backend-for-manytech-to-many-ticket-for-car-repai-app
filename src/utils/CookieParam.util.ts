export class CookieParam {
    static accessTokenName: string = "accessToken";
    static accessTokenPath: string = "/";
    static accessTokenExpiresIn: number = 24 * 60 * 60 * 1000;
    static accessTokenMaxAge: number = 24 * 60 * 60 * 1000;
    static refreshTokenName: string = "refreshToken";
    static refreshTokenPath: string = "/api/auth/refresh";
    static refreshTokenExpiresIn: number = 7 * 24 * 60 * 60 * 1000;
    static refreshTokenMaxAge: number = 7 * 24 * 60 * 60 * 1000;

}