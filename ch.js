// const fs = require("fs");
// const axios = require("axios");

// // Đọc danh sách proxy từ file
// function loadProxies(filename) {
//     try {
//         const data = fs.readFileSync(filename, "utf-8");
//         return data.split("\n").map(proxy => proxy.trim()).filter(proxy => proxy.length > 0);
//     } catch (err) {
//         console.error("❌ Lỗi đọc file proxy:", err);
//         return [];
//     }
// }

// // Kiểm tra proxy bằng request HTTP
// async function checkProxy(proxy) {
//     const [host, port] = proxy.split(":");
//     const proxyConfig = {
//         proxy: {
//             host: host,
//             port: parseInt(port),
//             protocol: "http"
//         },
//         timeout: 5000  // Timeout 5 giây
//     };

//     try {
//         const response = await axios.get("http://httpbin.org/ip", proxyConfig);
//         console.log(`✅ Proxy sống: ${proxy} | IP: ${response.data.origin}`);
//         return proxy; // Proxy hoạt động
//     } catch (err) {
//         return null; // Proxy chết
//     }
// }


// async function main() {
//     console.log("🔍 Đang tải danh sách proxy từ file proxy.txt...");
//     const proxies = loadProxies("proxy.txt");
//     console.log(`🔹 Đã tải ${proxies.length} proxy, bắt đầu kiểm tra...\n`);

//     const checkTasks = proxies.map(proxy => checkProxy(proxy));
//     const results = await Promise.all(checkTasks);

//     const liveProxies = results.filter(proxy => proxy !== null);

 
//     fs.writeFile("proxy.txt", liveProxies.join("\n"), "utf-8", (err) => {
//         if (err) {
//             console.error("❌ Lỗi ghi file:", err);
//         } else {
//             console.log(`✅ Đã lưu ${liveProxies.length} proxy sống vào p.txt`);
//         }
//     });


//     if (liveProxies.length > 0) {
//         console.log("\n🟢 Proxy sống:");
//         liveProxies.forEach(proxy => console.log(`✅ ${proxy}`));
//     } else {
//         console.log("\n❌ Không có proxy nào sống!");
//     }
// }

// main()
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
        console.log(`✅ HTTP Proxy sống: ${proxy} | IP: ${response.data.origin}`);
        return proxy;
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
        console.log(`✅ SOCKS${socksType} Proxy sống: ${proxy} | IP: ${response.data.origin}`);
        return proxy;
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
    fs.writeFileSync("live_http.txt", liveHttp.join("\n"), "utf-8");
    fs.writeFileSync("live_socks4.txt", liveSocks4.join("\n"), "utf-8");
    fs.writeFileSync("live_socks5.txt", liveSocks5.join("\n"), "utf-8");

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

