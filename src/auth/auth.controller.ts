import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard'; // Import the guard

@Controller('auth')
export class AuthController {

  @UseGuards(JwtAuthGuard) // Protect the route with the JwtAuthGuard
  @Get('protected-route')
  getProtectedData() {
    return 'This is protected data';
  }
}
