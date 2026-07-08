const { networkInterfaces } = require('os');

function getLocalIP() {
    const nets = networkInterfaces();
    for (const name of Object.keys(nets)) {
        for (const net of nets[name]) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return 'localhost';
}

const ip = getLocalIP();
const url = `http://${ip}:5173`;

console.log('');
console.log('  ========================================');
console.log('   Abre en tu CELULAR:');
console.log('');
console.log(`   ${url}`);
console.log('');
console.log('   (Tambien funciona en esta PC: http://localhost:5173)');
console.log('  ========================================');
console.log('');


