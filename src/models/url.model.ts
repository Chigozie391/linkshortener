import { AllowNull, AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { URLAttributes } from '../interfaces/url.interfaces';

@Table({
  modelName: 'url',
  timestamps: true,
  paranoid: true
})
export default class URL extends Model<URLAttributes> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id?: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  shortKey: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  originalUrl: string;

  @AllowNull(true)
  @Default(false)
  @Column(DataType.BOOLEAN)
  deletedFlag?: boolean;
}
