import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import csvParser = require('csv-parser');
import { ResearchRepository } from '../../research/research.repository';
import { CreateResearchDataDto } from 'src/research/dtos/research-data.dto';

@Injectable()
export class ResearchSeed {
  private readonly logger = new Logger(ResearchSeed.name);

  constructor(private readonly researchRepository: ResearchRepository) {}

  async seed() {
    this.logger.log('A iniciar o processo de seeding para: Dados da Pesquisa....');

    const dataFiles = [
      { year: 2016, filename: 'data_2016.csv' },
      { year: 2022, filename: 'data_2022.csv' },
    ];

    for (const fileInfo of dataFiles) {
      const filePath = path.join(
        __dirname,
        '..',
        'research-data',
        fileInfo.filename,
      );

      if (fs.existsSync(filePath)) {
        this.logger.log(`A processar o ficheiro: ${fileInfo.filename}`);
        await this.processFile(filePath, fileInfo.year);
      } else {
        this.logger.warn(
          `Ficheiro de dados não encontrado, a ignorar: ${filePath}`,
        );
      }
    }

    this.logger.log('Seeding dos Dados da Pesquisa concluído com sucesso.');
  }

  async cleanup(): Promise<void> {
    this.logger.log('A limpar os dados da pesquisa semeados...');
    try {
      await this.researchRepository.cleanup();
      this.logger.log('Limpeza dos dados da pesquisa concluída.');
    } catch (error) {
      this.logger.error('Falha ao limpar os dados da pesquisa.', error);
    }
  }

  private processFile(filePath: string, year: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const results: CreateResearchDataDto[] = [];

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row: any) => {
          const parsedRow: any = {};
          for (const key in row) {
            const value = parseFloat(row[key]);
            parsedRow[key] = isNaN(value) ? null : value;
          }

          const researchDataDto: CreateResearchDataDto = {
            year: year,
            studentId: parsedRow.ID,
            gre: parsedRow.gre,
            mesoregiao: parsedRow.mesoregiao,
            tipoEscola: parsedRow.tipoEscola,
            serie: parsedRow.serie,
            sexo: parsedRow.sexo,
            idade: parsedRow.idade,
            afTL: parsedRow.afTL,
            diasAFMV: parsedRow.diasAFMV,
            afmvH: parsedRow.afmvH,
            afmvMin: parsedRow.afmvMin,
            tvSemH: parsedRow.tvSemH,
            tvSemMin: parsedRow.tvSemMin,
            tvFdsH: parsedRow.tvFdsH,
            tvFdsMin: parsedRow.tvFdsMin,
            mediaTV_sem: parsedRow.mediaTV_sem,
            media_sed_tv: parsedRow.media_sed_tv,
            pcSemH: parsedRow.pcSemH,
            pcSemMin: parsedRow.pcSemMin,
            pcFdsH: parsedRow.pcFdsH,
            pcFdsMin: parsedRow.pcFdsMin,
            mediaPC_sem: parsedRow.mediaPC_sem,
            media_sed_pc: parsedRow.media_sed_pc,
            vgSemH: parsedRow.vgSemH,
            vgSemMin: parsedRow.vgSemMin,
            vgFdsH: parsedRow.vgFdsH,
            vgFdsMin: parsedRow.vgFdsMin,
            mediaVG_sem: parsedRow.mediaVG_sem,
            media_sed_vg: parsedRow.media_sed_vg,
            sptSemH: parsedRow.sptSemH,
            sptSemMin: parsedRow.sptSemMin,
            sptFdsH: parsedRow.sptFdsH,
            sptFdsMin: parsedRow.sptFdsMin,
            mediaSPT_sem: parsedRow.mediaSPT_sem,
            media_sed_spt: parsedRow.media_sed_spt,
            massa: parsedRow.massa,
            estatura: parsedRow.estatura,
          };

          if (researchDataDto.studentId) {
            results.push(researchDataDto);
          }
        })
        .on('end', async () => {
          this.logger.log(
            `Leitura do ficheiro concluída. ${results.length} registos prontos para serem inseridos/atualizados.`,
          );
          try {
            await this.researchRepository.upsertMany(results);
            resolve();
          } catch (error) {
            this.logger.error('Falha ao inserir dados em massa.', error.stack);
            reject(error);
          }
        })
        .on('error', (error) => {
          this.logger.error(
            'Ocorreu um erro ao ler o ficheiro CSV.',
            error.stack,
          );
          reject(error);
        });
    });
  }
}

