import { IsString } from 'class-validator';

export class CreateMensajeDto {
  @IsString()
  de: string;

  @IsString()
  para: string;

  @IsString()
  mensaje: string;
}
