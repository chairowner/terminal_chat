import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	Default,
} from "sequelize-typescript";

@Table({
	tableName: "users",
	timestamps: false,
})
export class UserModel extends Model {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	id!: string;

	@Column({
		type: DataType.STRING(100),
		allowNull: false,
		unique: true,
	})
	login!: string;

	@Column({
		type: DataType.CHAR(60),
		allowNull: false,
	})
	password!: string;

	@Default(false)
	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
	})
	banned!: boolean;

	@Default(false)
	@Column({
		type: DataType.BOOLEAN,
		allowNull: false,
	})
	deleted!: boolean;

	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	created_at!: Date;

	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	updated_at!: Date;

	@Default(DataType.NOW)
	@Column({
		type: DataType.DATE,
		allowNull: false,
	})
	last_online_at!: Date;
}
