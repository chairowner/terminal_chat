import { ModuleOptions } from "webpack";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import ReactRefreshTypeScript from "react-refresh-typescript";
import { BuildOptions } from "./types/types";
import { buildBabelLoader } from "./babel/buildBabelLoader";

export function buildLoaders({ mode }: BuildOptions): ModuleOptions["rules"] {
	const isProd = mode === "production";
	const isDev = mode === "development";

	const scssModuleLoader = {
		loader: "css-loader",
		options: {
			modules: {
				localIdentName: isProd ? "[hash:base64:12]" : "[path][name]__[local]",
			},
		},
	};

	const scssLoader = {
		test: /\.s[ac]ss$/i,
		use: [
			isProd ? MiniCssExtractPlugin.loader : "style-loader",
			scssModuleLoader,
			"sass-loader",
		],
	};

	const tsLoader = {
		test: /\.tsx?$/,
		exclude: /node_modules/,
		use: [
			{
				loader: "ts-loader",
				options: {
					transpileOnly: true,
					getCustomTransformers: () => ({
						before: [isDev && ReactRefreshTypeScript()].filter(Boolean),
					}),
				},
			},
		],
	};

	const babelLoader = buildBabelLoader();

	const assetLoader = {
		test: /\.(png|jpg|jpeg|gif)$/i,
		type: "asset/resource",
	};
	const svgrLoader = {
		test: /\.svg$/i,
		use: [
			{
				loader: "@svgr/webpack",
				options: {
					icon: true,
					svgoConfig: {
						plugins: [
							{
								name: "convertColors",
								params: {
									currentColor: true,
								},
							},
						],
					},
				},
			},
		],
	};

	return [
		svgrLoader,
		assetLoader,
		scssLoader,
		// tsLoader,
		babelLoader,
	];
}
