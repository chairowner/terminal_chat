declare const __DEBUG__: boolean;
declare const __PLATFORM__: "mobile" | "desktop";
declare const __SERVER_URL__: string;
declare const __SOCKET_SERVER_URL__: string;
declare module "*.txt";
declare module "*.md";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg" {
	import { FC, SVGProps } from "react";
	const SVG: FC<SVGProps<SVGSVGElement>>;
	export default SVG;
}
declare module "*.module.scss" {
	interface IClassNames {
		[className: string]: string;
	}
	const classNames: IClassNames;
	export = classNames;
}
