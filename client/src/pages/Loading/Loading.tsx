import s from "./Loading.module.scss";

const Loading = () => {
	return (
		<div className={s.container}>
			<h1 className={s.loading}>Loading...</h1>
		</div>
	);
};

export default Loading;
