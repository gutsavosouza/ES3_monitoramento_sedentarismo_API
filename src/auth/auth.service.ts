import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { LoginReturnDTO } from './dtos/login-return.dto';
import { UsersRepository } from 'src/users/users.repository';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { RefreshTokenRepository } from './refresh-token.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
  ) {}

  async login(loginData: LoginDTO): Promise<LoginReturnDTO> {
    const user = await this.usersRepository.findByEmail(loginData.email);

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const valid_password = await bcrypt.compare(
      loginData.password,
      user.password,
    );

    if (!valid_password) {
      throw new UnauthorizedException('Credenciais inválidas.');
    }

    const payload: { id: any; email: string } = {
      id: user._id,
      email: user.email,
    };

    const tokens = this._generateTokens(payload);

    return tokens;
  }

  private async _generateTokens(payload: any): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    const access_token = this.jwtService.sign(payload);

    const refresh_token = uuidv4();

    // generate refresh token and bind it to user
    await this.refreshTokenRepository.saveRefreshToken(
      refresh_token,
      payload.id,
    );

    return {
      access_token,
      refresh_token,
    };
  }
}
