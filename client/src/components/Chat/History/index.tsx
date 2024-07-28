import { forwardRef, RefObject } from "react";
import s from "./History.module.scss";
import { IMessage } from "@/interfaces/database";

interface IHistory {
	history: IMessage[];
	ref: RefObject<HTMLDivElement>;
}

export const History = forwardRef<HTMLDivElement, IHistory>(
	({ history }, ref) => {
		return (
			<div className={s.container} ref={ref}>
				{history && history.length ? (
					history.map((item) => {
						return (
							<div className={s.item} key={item.id}>
								<span
									className={s.messageInfo}
									title={item.created_at?.toLocaleString("en")}
								>
									<span>
										[
										{item.user?.login ?? (
											<span className={s.deleted}>*deleted*</span>
										)}
										]:
									</span>
								</span>
								{item.deleted ? (
									<span className={s.deleted}>*deleted*</span>
								) : (
									<span>{item.text}</span>
								)}
							</div>
						);
					})
				) : (
					<p>Пока что в чате нет сообщений</p>
				)}
			</div>
		);
	}
);
