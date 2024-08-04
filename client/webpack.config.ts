import { Configuration } from "webpack";
import { buildWebpack } from "./config/build/buildWebpack";
import {
	BuildMode,
	BuildPaths,
	BuildPlatform,
} from "./config/build/types/types";
import path from "path";

interface EnvVariables {
	serverUrl: string;
	phpMyAdminUrl: string | null;
	socketServerUrl: string;
	port: number;
	mode: BuildMode;
	bundleAnalyze: boolean;
	devServer: boolean;
	debug: boolean;
	platform: BuildPlatform;
}

export default (env: EnvVariables) => {
	const paths: BuildPaths = {
		output: path.resolve(__dirname, "build"),
		entry: path.resolve(__dirname, "src", "index.tsx"),
		html: path.resolve(__dirname, "public", "index.html"),
		public: path.resolve(__dirname, "public"),
		src: path.resolve(__dirname, "src"),
	};

	const config: Configuration = buildWebpack({
		phpMyAdminUrl: env.phpMyAdminUrl || null,
		devServer: env.devServer || false,
		debug: env.debug || false,
		port: env.port || 80,
		mode: env.mode || "production",
		platform: env.platform || "desktop",
		serverUrl: env.serverUrl || "http://localhost:3000",
		socketServerUrl: env.socketServerUrl || "http://localhost:3001",
		bundleAnalyze: env.bundleAnalyze,
		paths,
	});

	return config;
};
