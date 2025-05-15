// next.config.js
const nextConfig = {
    // async headers() {
    //   return [
    //     {
    //       source: '/',
    //       headers: [
    //         {
    //           key: 'X-Forwarded-For',
    //           value: 'req.connection.remoteAddress',
    //         },
    //       ],
    //     },
    //   ];
    // },
    reactStrictMode: true,
    images: {
        dangerouslyAllowSVG: true,
        domains: [
            'cdn.poizon.com',
            'drive.google.com',
            'storage.yandexcloud.net',
            's924sas.storage.yandex.net',
            'img.stadiumgoods.com',
            'console.cloud.yandex.ru',
            'bucket.sellout.su',
            'sellout.su',
            'img.icons8.com'
        ],
    },
    experimental: {
        scrollRestoration: true,
    },
    async redirects() {
        return [];
    },
    // Другие настройки, если есть
};

module.exports = nextConfig;
