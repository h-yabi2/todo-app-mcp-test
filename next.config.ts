import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pagesのベースパスを設定
  basePath: "/todo-app-mcp-test",
  // 画像の最適化を無効化（GitHub Pages用）
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
