import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginDTO } from './dtos/login.dto';
import { AuthService } from './auth.service';
import { RefreshTokenDTO } from './dtos/refresh-token.dto';
import { ApiBody, ApiResponse } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDTO })
  @ApiResponse({
    status: 200,
    description:
      'Login was succesful, access token and refresh token are returned',
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginData: LoginDTO) {
    return await this.authService.login(loginData);
  }

  @ApiBody({ type: RefreshTokenDTO })
  @ApiResponse({
    status: 200,
    description:
      'Refresh was successful and new tokens are generated, the previous ones were deleted.',
  })
  @ApiResponse({
    status: 401,
    description: 'The sent token was invalid and nothing was done',
  })
  @HttpCode(200)
  @Post('refresh-token')
  async refreshTokens(@Body() RefreshTokenDTO: RefreshTokenDTO) {
    return this.authService.refreshToken(RefreshTokenDTO.token);
  }
}
