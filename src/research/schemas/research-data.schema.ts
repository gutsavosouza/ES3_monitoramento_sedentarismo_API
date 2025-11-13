import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ResearchDataDocument = ResearchData & Document;

@Schema({ timestamps: true, collection: 'research_data' })
export class ResearchData {
  @Prop({ required: true })
  year: number;

  @Prop({ required: true, unique: false })
  studentId: number;

  @Prop()
  gre: number;

  @Prop()
  mesoregiao: number;

  @Prop()
  tipoEscola: number;

  @Prop()
  serie: number;

  @Prop()
  sexo: number;

  @Prop()
  idade: number;

  @Prop()
  afTL: number;

  @Prop()
  diasAFMV: number;

  @Prop()
  afmvH: number;

  @Prop()
  afmvMin: number;

  @Prop()
  tvSemH: number;

  @Prop()
  tvSemMin: number;

  @Prop()
  tvFdsH: number;

  @Prop()
  tvFdsMin: number;

  @Prop()
  mediaTV_sem: number;

  @Prop()
  media_sed_tv: number;

  @Prop()
  pcSemH: number;

  @Prop()
  pcSemMin: number;

  @Prop()
  pcFdsH: number;

  @Prop()
  pcFdsMin: number;

  @Prop()
  mediaPC_sem: number;

  @Prop()
  media_sed_pc: number;

  @Prop()
  vgSemH: number;

  @Prop()
  vgSemMin: number;

  @Prop()
  vgFdsH: number;

  @Prop()
  vgFdsMin: number;

  @Prop()
  mediaVG_sem: number;

  @Prop()
  media_sed_vg: number;

  @Prop()
  sptSemH: number;

  @Prop()
  sptSemMin: number;

  @Prop()
  sptFdsH: number;

  @Prop()
  sptFdsMin: number;

  @Prop()
  mediaSPT_sem: number;

  @Prop()
  media_sed_spt: number;

  @Prop()
  massa: number;

  @Prop()
  estatura: number;

  @Prop()
  bmi: number;

  @Prop()
  dailyTvTime: number;

  @Prop()
  dailyPcTime: number;

  @Prop()
  dailyVgTime: number;

  @Prop()
  dailySptTime: number;

  @Prop()
  totalDailyScreenTime: number;
}

export const ResearchDataSchema = SchemaFactory.createForClass(ResearchData);

ResearchDataSchema.index({ studentId: 1, year: 1 }, { unique: true });
