import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../auth/entities/user.entity';

@Entity({ name: 'mensajes', synchronize: true })
export class Mensaje {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'remitente_id' })
  remitente: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'destinatario_id' })
  destinatario: User;

  @CreateDateColumn({
    name: 'fecha_creacion',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fechaCreacion: Date;

  @Column({ type: 'varchar', length: 255 })
  mensaje: string;
}
