import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database.service';
import * as bcrypt from 'bcrypt';

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
}

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async login(email: string, pass: string) {
    // 1. Query the database using our raw SQL service
    const result = await this.db.query<UserRow>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    const user = result.rows[0];

    // 2. Check if user exists
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 3. Compare the provided password with the hashed database password
    const isPasswordValid = await bcrypt.compare(pass, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // 4. Generate a JWT token if successful
    const payload = { sub: user.id, name: user.name, email: user.email };

    return {
      access_token: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
