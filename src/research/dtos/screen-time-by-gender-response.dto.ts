import { ApiProperty } from '@nestjs/swagger';

export class ScreenTimeByGenderResponseDto {
  @ApiProperty({
    example: 'Masculino',
    description: 'Gênero (Masculino ou Feminino)',
  })
  gender: string;

  @ApiProperty({
    example: 120.5,
    description: 'Tempo médio diário de TV em minutos',
  })
  averageTvTime: number;

  @ApiProperty({
    example: 90.0,
    description: 'Tempo médio diário de PC em minutos',
  })
  averagePcTime: number;

  @ApiProperty({
    example: 60.0,
    description: 'Tempo médio diário de Video Game em minutos',
  })
  averageVgTime: number;

  @ApiProperty({
    example: 180.0,
    description: 'Tempo médio diário de Smartphone/Tablet em minutos',
  })
  averageSptTime: number;
}
