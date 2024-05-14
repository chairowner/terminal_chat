import {
	Table,
	Column,
	Model,
	DataType,
	PrimaryKey,
	Default,
	ForeignKey,
	BelongsTo,
} from "sequelize-typescript";
import { UserModel } from "./UserModel";

@Table({
	tableName: "messages",
	timestamps: false, // отключаем автоматическое управление временными метками
})
export class MessageModel extends Model {
	@PrimaryKey
	@Default(DataType.UUIDV4)
	@Column(DataType.UUID)
	id!: string;

	@ForeignKey(() => UserModel)
	@Column({
		type: DataType.UUID,
		allowNull: true,
		onDelete: "SET NULL",
		onUpdate: "CASCADE",
	})
	userId!: string;

	@BelongsTo(() => UserModel)
	user!: UserModel;

	@Column({
		type: DataType.TEXT,
		allowNull: false,
	})
	text!: string;

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
}
