import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  RefreshToken,
  RefreshTokenDocument,
} from './schemas/refresh-token.schema';
import { Model } from 'mongoose';

@Injectable()
export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshToken.name)
    private refreshTokenModel: Model<RefreshTokenDocument>,
  ) {}

  async saveRefreshToken(
    token: string,
    userId: any,
  ): Promise<RefreshToken | null> {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 3); // 3 days from current date

    return await this.refreshTokenModel.findOneAndUpdate(
      {
        userId,
      },
      {
        $set: {
          token,
          expiryDate,
        },
      },
      { upsert: true },
    );
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return this.refreshTokenModel.findOne({ token }).exec();
  }
}
