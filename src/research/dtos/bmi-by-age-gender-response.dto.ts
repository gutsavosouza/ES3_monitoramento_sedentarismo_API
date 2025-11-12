import { ApiProperty } from '@nestjs/swagger';

class BmiResultDto {
  @ApiProperty({
    example: 'Masculino',
    description: 'Gênero (Masculino ou Feminino)',
  })
  gender: string;

  @ApiProperty({
    example: 20.5,
    description: 'Média do IMC para o gênero e faixa etária',
  })
  averageBmi: number;
}

export class BmiByAgeGenderResponseDto {
  @ApiProperty({
    example: '14-15',
    description: 'Faixa etária',
  })
  ageGroup: string;

  @ApiProperty({
    type: [BmiResultDto],
    description: 'Resultados do IMC para a faixa etária',
  })
  results: BmiResultDto[];
}
