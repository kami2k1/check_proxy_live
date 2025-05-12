const fs = require("fs");
const axios = require("axios");

// Đọc danh sách proxy từ file
function loadProxies(filename) {
    try {
        const data = fs.readFileSync(filename, "utf-8");
        return data.split("\n").map(proxy => proxy.trim()).filter(proxy => proxy.length > 0);
    } catch (err) {
        console.error("❌ Lỗi đọc file proxy:", err);
        return [];
    }
}

// Kiểm tra proxy HTTP
async function checkHttpProxy(proxy) {
    const [host, port] = proxy.split(":");

    try {
        const response = await axios.get("http://httpbin.org/ip", {
            proxy: {
                host: host,
                port: parseInt(port),
                protocol: "http"
            },
            timeout: 30000
        });
        if (response.data.origin && response.data.origin.split(',').length === 1) {
            console.log(`✅ HTTP Proxy sống & ẩn IP: ${proxy} | IP: ${response.data.origin.trim()}`);
            return proxy;
        } else {
            console.log(`❌ Proxy lộ IP: ${proxy} | IPs: ${response.data.origin}`);
        }
        return null
    } catch (err) {
        return null;
    }
}

// Kiểm tra proxy SOCKS4 / SOCKS5
async function checkSocksProxy(proxy, socksType = 5) {
    const [host, port] = proxy.split(":");

    try {
        const response = await axios.get("http://httpbin.org/ip", {
            httpAgent: new (require('socks-proxy-agent')).SocksProxyAgent(`socks${socksType}://${host}:${port}`),
            timeout: 30000
        });
        if (response.data.origin && response.data.origin.split(',').length === 1) {
            console.log(`✅ HTTP Proxy sống & ẩn IP: ${proxy} | IP: ${response.data.origin.trim()}`);
            return proxy;
        } else {
            console.log(`❌ Proxy lộ IP: ${proxy} | IPs: ${response.data.origin}`);
        }
            return null
    } catch (err) {
        return null;
    }
}

async function main() {
    console.log("🔍 Đang tải danh sách proxy...");

    const httpProxies = loadProxies("http.txt");
    const socks4Proxies = loadProxies("socks4.txt");
    const socks5Proxies = loadProxies("socks5.txt");

    console.log(`HTTP: ${httpProxies.length} | SOCKS4: ${socks4Proxies.length} | SOCKS5: ${socks5Proxies.length}`);

    const httpTasks = httpProxies.map(proxy => checkHttpProxy(proxy));
    const socks4Tasks = socks4Proxies.map(proxy => checkSocksProxy(proxy, 4));
    const socks5Tasks = socks5Proxies.map(proxy => checkSocksProxy(proxy, 5));

    const [httpResults, socks4Results, socks5Results] = await Promise.all([
        Promise.all(httpTasks),
        Promise.all(socks4Tasks),
        Promise.all(socks5Tasks)
    ]);

    const liveHttp = httpResults.filter(p => p !== null);
    const liveSocks4 = socks4Results.filter(p => p !== null);
    const liveSocks5 = socks5Results.filter(p => p !== null);

    // Lưu lại
    fs.writeFileSync("http.txt", liveHttp.join("\n"), "utf-8");
    fs.writeFileSync("socks4.txt", liveSocks4.join("\n"), "utf-8");
    fs.writeFileSync("socks5.txt", liveSocks5.join("\n"), "utf-8");

    console.log("\n🔵 Kết quả:");
    console.log(`✅ HTTP sống: ${liveHttp.length}`);
    console.log(`✅ SOCKS4 sống: ${liveSocks4.length}`);
    console.log(`✅ SOCKS5 sống: ${liveSocks5.length}`);

    if (liveHttp.length === 0 && liveSocks4.length === 0 && liveSocks5.length === 0) {
        console.log("\n❌ Không có proxy nào sống!");
    }
}

// Gọi hàm main
main();

