import { Configuration } from "webpack";
import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildOptions } from "./types/types";
import TerserPlugin from "terser-webpack-plugin";

export function buildWebpack(options: BuildOptions): Configuration {
	const { mode, paths, devServer } = options;
	const isDev = mode === "development";

	const webpack: Configuration = {
		mode: mode || "production",
		watch: false,
		entry: {
			main: paths.entry,
		},
		plugins: buildPlugins(options),
		module: {
			rules: buildLoaders(options),
		},
		resolve: buildResolvers(options),
		output: {
			clean: true,
			path: paths.output,
			filename: "js/[name].[contenthash].js",
			publicPath: "/",
		},
		// optimization: {
		// 	minimize: true,
		// 	minimizer: [
		// 		new TerserPlugin({
		// 			terserOptions: {
		// 				compress: {
		// 					drop_console: true,
		// 				},
		// 			},
		// 		}),
		// 	],
		// },
		devtool: isDev ? "inline-source-map" : false,
		devServer: devServer ? buildDevServer(options) : undefined,
	};

	return webpack;
}
