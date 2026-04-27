import { Eureka } from 'eureka-js-client';

// const eurekaHost = process.env.EUREKA_HOST || '127.0.0.1';
// const eurekaPort = Number(process.env.EUREKA_PORT || 8761);

// const client = Eureka({
//     instance: {
//         app: 'API-GATEWAY',
//         instanceId: 'api-gateway-3000',
//         hostName: '127.0.0.1',
//         ipAddr: '127.0.0.1',
//         port: {
//             '$': 3000,
//             '@enabled': true
//         },
//         vipAddress: 'api-gateway',
//         dataCenterInfo: {
//             '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
//             name: 'MyOwn'
//         }
//     },
//     eureka: {
//         host: eurekaHost,
//         port: eurekaPort,
//         servicePath: '/eureka/apps/'
//     }
// })

// export function startEureka() {
//     if (!client) {
//         console.log(
//             'Eureka: skipped (set EUREKA_ENABLED=true when a Eureka server is available)'
//         );
//         return;
//     }
//     client.start(err => {
//         if (err) {
//             console.error('Eureka registration failed', err);
//         } else {
//             console.log('Eureka registered successfully');
//         }
//     });
// }

const client = new Eureka({
    instance: {
        app: process.env.SERVICE_NAME || 'API',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': PORT,
            '@enabled': true,
        },
        vipAddress: 'BOOK-SERVICE',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/',
    },
});

client.start((err) => {
    console.log(err || 'Registered with Eureka');
});