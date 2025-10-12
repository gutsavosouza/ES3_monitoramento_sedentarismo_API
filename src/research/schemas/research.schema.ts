import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ResearchDocument = HydratedDocument<Research>;

@Schema({ collection: 'research' })
export class Research {
  @Prop({ required: true, type: Number })
  year: number;

  @Prop({ type: Number })
  ID: number;

  @Prop({ type: Number })
  gre: number;

  @Prop({ type: Number })
  mesoregiao: number;

  @Prop({ type: Number })
  tipoEscola: number;

  @Prop({ type: Number })
  serie: number;

  @Prop({ type: Number })
  sexo: number;

  @Prop({ type: Number })
  idade: number;

  @Prop({ type: Number })
  afTL: number;

  @Prop({ type: Number })
  diasAFMV: number;

  @Prop({ type: Number })
  afmvH: number;

  @Prop({ type: Number })
  afmvMin: number;

  @Prop({ type: Number })
  tvSemH: number;

  @Prop({ type: Number })
  tvSemMin: number;

  @Prop({ type: Number })
  tvFdsH: number;

  @Prop({ type: Number })
  tvFdsMin: number;

  @Prop({ type: Number })
  mediaTV_sem: number;

  @Prop({ type: Number })
  media_sed_tv: number;

  @Prop({ type: Number })
  pcSemH: number;

  @Prop({ type: Number })
  pcSemMin: number;

  @Prop({ type: Number })
  pcFdsH: number;

  @Prop({ type: Number })
  pcFdsMin: number;

  @Prop({ type: Number })
  mediaPC_sem: number;

  @Prop({ type: Number })
  media_sed_pc: number;

  @Prop({ type: Number })
  vgSemH: number;

  @Prop({ type: Number })
  vgSemMin: number;

  @Prop({ type: Number })
  vgFdsH: number;

  @Prop({ type: Number })
  vgFdsMin: number;

  @Prop({ type: Number })
  mediaVG_sem: number;

  @Prop({ type: Number })
  media_sed_vg: number;

  @Prop({ type: Number })
  sptSemH: number;

  @Prop({ type: Number })
  sptSemMin: number;

  @Prop({ type: Number })
  sptFdsH: number;

  @Prop({ type: Number })
  sptFdsMin: number;

  @Prop({ type: Number })
  mediaSPT_sem: number;

  @Prop({ type: Number })
  media_sed_spt: number;

  @Prop({ type: Number })
  massa: number;

  @Prop({ type: Number })
  estatura: number;
}

export const ResearchSchema = SchemaFactory.createForClass(Research);