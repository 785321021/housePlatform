// 
module.exports = {
    publicPath: '/',
    devServer: {
        port:8082,
        proxy: {
            '/c-api': {
                // target: 'http://juqi.137idea.com:8089',
                target: 'http://localhost:8089',
                changeOrigin: true,
                ws: true,
            },
            '/b-api':{
                // target: 'http://juqi.137idea.com:8089',
                target: 'http://localhost:8090',
                changeOrigin: true,
                ws: true,
            }
        }
    }
}