export interface BuildPaths {
	entry: string;
	html: string;
	output: string;
	public: string;
	src: string;
}

export type BuildMode = "production" | "development";
export type BuildPlatform = "mobile" | "desktop";

export interface BuildOptions {
	serverUrl: string;
	phpMyAdminUrl: string | null;
	socketServerUrl: string;
	port: number;
	paths: BuildPaths;
	mode: BuildMode;
	platform: BuildPlatform;
	bundleAnalyze?: boolean;
	devServer: boolean;
	debug: boolean;
}
