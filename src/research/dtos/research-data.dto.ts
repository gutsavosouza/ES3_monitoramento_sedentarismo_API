import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateResearchDataDto {
  @IsNumber()
  @IsNotEmpty()
  year: number;

  @IsNumber()
  @IsNotEmpty()
  studentId: number;

  @IsNumber()
  @IsOptional()
  gre?: number;

  @IsNumber()
  @IsOptional()
  mesoregiao?: number;

  @IsNumber()
  @IsOptional()
  tipoEscola?: number;

  @IsNumber()
  @IsOptional()
  serie?: number;

  @IsNumber()
  @IsOptional()
  sexo?: number;

  @IsNumber()
  @IsOptional()
  idade?: number;

  @IsNumber()
  @IsOptional()
  afTL?: number;

  @IsNumber()
  @IsOptional()
  diasAFMV?: number;

  @IsNumber()
  @IsOptional()
  afmvH?: number;

  @IsNumber()
  @IsOptional()
  afmvMin?: number;

  @IsNumber()
  @IsOptional()
  tvSemH?: number;

  @IsNumber()
  @IsOptional()
  tvSemMin?: number;

  @IsNumber()
  @IsOptional()
  tvFdsH?: number;

  @IsNumber()
  @IsOptional()
  tvFdsMin?: number;

  @IsNumber()
  @IsOptional()
  mediaTV_sem?: number;

  @IsNumber()
  @IsOptional()
  media_sed_tv?: number;

  @IsNumber()
  @IsOptional()
  pcSemH?: number;

  @IsNumber()
  @IsOptional()
  pcSemMin?: number;

  @IsNumber()
  @IsOptional()
  pcFdsH?: number;

  @IsNumber()
  @IsOptional()
  pcFdsMin?: number;

  @IsNumber()
  @IsOptional()
  mediaPC_sem?: number;

  @IsNumber()
  @IsOptional()
  media_sed_pc?: number;

  @IsNumber()
  @IsOptional()
  vgSemH?: number;

  @IsNumber()
  @IsOptional()
  vgSemMin?: number;

  @IsNumber()
  @IsOptional()
  vgFdsH?: number;

  @IsNumber()
  @IsOptional()
  vgFdsMin?: number;

  @IsNumber()
  @IsOptional()
  mediaVG_sem?: number;

  @IsNumber()
  @IsOptional()
  media_sed_vg?: number;

  @IsNumber()
  @IsOptional()
  sptSemH?: number;

  @IsNumber()
  @IsOptional()
  sptSemMin?: number;

  @IsNumber()
  @IsOptional()
  sptFdsH?: number;

  @IsNumber()
  @IsOptional()
  sptFdsMin?: number;

  @IsNumber()
  @IsOptional()
  mediaSPT_sem?: number;

  @IsNumber()
  @IsOptional()
  media_sed_spt?: number;

  @IsNumber()
  @IsOptional()
  massa?: number;

  @IsNumber()
  @IsOptional()
  estatura?: number;
}

