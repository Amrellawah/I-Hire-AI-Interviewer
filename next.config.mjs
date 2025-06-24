/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.usegalileo.ai'],
  },
  webpack: (config, { isServer }) => {
    // Handle large model files
    config.module.rules.push({
      test: /\.(safetensors|bin)$/,
      type: 'asset/resource',
    });

    // Completely ignore .node files
    config.module.rules.push({
      test: /\.node$/,
      use: 'ignore-loader',
    });

    // Exclude problematic packages from client-side bundling
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@xenova/transformers': 'commonjs @xenova/transformers',
        'onnxruntime-node': 'commonjs onnxruntime-node',
        'sharp': 'commonjs sharp',
      });
    }

    // Optimize for transformers library
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    return config;
  },
  serverExternalPackages: ['@xenova/transformers', 'onnxruntime-node', 'sharp'],
};
  
export default nextConfig;
  