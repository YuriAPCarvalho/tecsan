import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOkResponse, ApiTags, ApiBadRequestResponse } from '@nestjs/swagger';
import { AuthEntity } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';

@ApiTags("auth")
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse({ type: AuthEntity })
  @ApiBadRequestResponse({ description: 'Invalid credentials' })
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<AuthEntity> {
    return this.authService.login(loginDto.cpf, loginDto.senha);
  }

  @ApiOkResponse({ type: AuthEntity })
  @ApiBadRequestResponse({ description: 'Invalid refresh token' })
  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }): Promise<AuthEntity> {
    return this.authService.refreshToken(body.refreshToken);
  }
}
