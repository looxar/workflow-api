// auth.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { LoggedInDto } from './dto/logged-in.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v7 as uuidv7 } from 'uuid';
import { Observable, of } from 'rxjs';

@Injectable()
export class AuthService {
  private logger = new Logger();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<LoggedInDto> {
    // find user by username
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      this.logger.debug(
        `user not found: username=${username}`,
        AuthService.name,
      );
      return null;
    }

    // found & compare
    if (await bcrypt.compare(password, user.password)) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } else {
      this.logger.debug(`wrong password: username=${username}`);
      return null;
    }
  }

  async validateUserByAccessToken(accessToken: string): Promise<LoggedInDto> {
    const userInfo: { preferred_username: string } =
      await this.jwtService.decode(accessToken);

    const user = await this.usersService.findOneByUsername(
      userInfo.preferred_username,
    );
    if (!user) {
      this.logger.debug(
        `user not found: username=${userInfo.preferred_username}`,
        AuthService.name,
      );
      return null;
    }

    const { password, ...userWithoutPassword } = user;

    return userWithoutPassword;
  }

  login(loggedDto: LoggedInDto) {
    console.log('Logging in user:', loggedDto);

    // sign access_token
    const payload: LoggedInDto = { ...loggedDto, sub: loggedDto.id };
    console.log('JWT Payload:', payload);
    const access_token = this.jwtService.sign(payload);

    // sign refresh_token
    const refreshTokenSecret = this.configService.get('REFRESH_JWT_SECRET');
    const refreshTokenExpiresIn = this.configService.get(
      'REFRESH_JWT_EXPIRES_IN',
    );
    const refresh_token = this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpiresIn,
    });
    console.log('Generated tokens:', { access_token, refresh_token });
    // return access_token & refresh_token
    return { access_token, refresh_token };
  }

  refreshToken(loggedDto: LoggedInDto) {
    // sign new access_token (refresh it!)
    const payload: LoggedInDto = { ...loggedDto, sub: loggedDto.id };
    const access_token = this.jwtService.sign(payload);
    return { access_token };
  }

  // getOauth2RedirectUrl(forceLogin: boolean = false): string {
  //   const auth_url = this.configService.get('OAUTH2_AUTH_URL');
  //   const client_id = this.configService.get('OAUTH2_CLIENT_ID');
  //   const redirect_uri = this.configService.get('OAUTH2_CALLBACK_URL');
  //   const scope = encodeURIComponent(this.configService.get('OAUTH2_SCOPE'));
  //   const response_type = this.configService.get('OAUTH2_RESPONSE_TYPE');
  //   const state = uuidv7();
  
  //   // Add the `prompt=login` parameter to force a new login if `forceLogin` is true
  //   const prompt = forceLogin ? 'login' : 'none';
  
  //   return `${auth_url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&state=${state}&prompt=${prompt}`;
  // }

  getOauth2RedirectUrl(): string {
    const auth_url = this.configService.get('OAUTH2_AUTH_URL')
    const client_id = this.configService.get('OAUTH2_CLIENT_ID');
    const redirect_uri = this.configService.get('OAUTH2_CALLBACK_URL');
    const scope = encodeURIComponent(this.configService.get('OAUTH2_SCOPE'));
    const response_type = this.configService.get('OAUTH2_RESPONSE_TYPE');
    const state = uuidv7();
    return `${auth_url}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&response_type=${response_type}&state=${state}`
  }
}
