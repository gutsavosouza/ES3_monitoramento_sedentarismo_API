import { IsArray, IsMongoId } from 'class-validator';
import { CreateActivityDTO } from './create-activity.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGroupActivityDTO extends CreateActivityDTO {
  @ApiProperty({
    description: 'An array of user IDs who participated in the activity',
    example: ['6522cbb541a3371898748165', '6522cbc941a3371898748167'],
    type: [String],
  })
  @IsArray()
  @IsMongoId({ each: true })
  participantIds: any[];
}
