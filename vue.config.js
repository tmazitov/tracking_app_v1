module.exports = {
    lintOnSave: false,
    runtimeCompiler: true,
    devServer: {
        clientLogLevel: "info",
        disableHostCheck: true,
        host: "localhost",
        port: process.env.VUE_APP_LISTENER_PORT,
        proxy: {
            "/aaa/api": {
                target: "http://127.0.0.1:5000",
            },
            "/adm/api": {
                target: "http://127.0.0.1:5002",  
            },
            "/tms/api": {
                target: "http://127.0.0.1:5001",
            },
            "/tms/ws": {
                target: "ws://127.0.0.1:5001",
                changeOrigin: true,
                ws: true
            },

        },
    },
};