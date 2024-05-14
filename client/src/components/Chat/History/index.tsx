import { FC } from "react";
import s from "./History.module.scss";
import { IMessage } from "@/interfaces/database";

interface IHistory {
	history: IMessage[];
}

export const History: FC<IHistory> = ({ history }) => {
	return (
		<div className={s.container}>
			{history && history.length ? (
				history.map((item) => (
					<span key={item.id}>
						[{item.created_at}][{item.user.login}]:{" "}
						{item.deleted ? (
							<span
								style={{
									fontSize: "14px",
									fontStyle: "italic",
									fontWeight: "bold",
								}}
							>
								*deleted*
							</span>
						) : (
							item.text
						)}
					</span>
				))
			) : (
				<p>Пока что в чате нет сообщений</p>
			)}
		</div>
	);
};
