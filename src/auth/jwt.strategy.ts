import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRT } from 'src/utils/const';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRT, // même clé que dans sign()
    });
  }

  async validate(payload: any) {
    // payload contient les données encodées dans le token
    return { id: payload.id, username: payload.username, role: payload.role };
  }
}
