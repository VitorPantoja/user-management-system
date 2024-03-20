import { sign } from 'jsonwebtoken';
import type { PayloadTokenDto } from '../../domain/dto/jwt.dto';
import { env } from '../../infrastructure/config/environment';

export class JwtService {
  constructor() {}

  async sign() {
    return 'sign';
  }
  //FIX ME: melhorar
  async genereateToken(payload: PayloadTokenDto) {
    const token = sign({ ...payload }, env.APP_SECRET);
  }

  async verify() {
    return 'verify';
  }
}
