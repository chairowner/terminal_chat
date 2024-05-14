import { Configuration } from "webpack";
import { buildDevServer } from "./buildDevServer";
import { buildLoaders } from "./buildLoaders";
import { buildPlugins } from "./buildPlugins";
import { buildResolvers } from "./buildResolvers";
import { BuildOptions } from "./types/types";

export function buildWebpack(options: BuildOptions): Configuration {
	const { mode, paths } = options;
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
		devtool: false,
		devServer: undefined,
	};
	if (isDev) {
		webpack.devtool = "inline-source-map";
		webpack.devServer = buildDevServer(options);
	}

	return webpack;
}
