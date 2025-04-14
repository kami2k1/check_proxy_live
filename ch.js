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

// Kiểm tra proxy bằng request HTTP
async function checkProxy(proxy) {
    const [host, port] = proxy.split(":");
    const proxyConfig = {
        proxy: {
            host: host,
            port: parseInt(port),
            protocol: "http"
        },
        timeout: 5000  // Timeout 5 giây
    };

    try {
        const response = await axios.get("http://httpbin.org/ip", proxyConfig);
        console.log(`✅ Proxy sống: ${proxy} | IP: ${response.data.origin}`);
        return proxy; // Proxy hoạt động
    } catch (err) {
        return null; // Proxy chết
    }
}


async function main() {
    console.log("🔍 Đang tải danh sách proxy từ file proxy.txt...");
    const proxies = loadProxies("proxy.txt");
    console.log(`🔹 Đã tải ${proxies.length} proxy, bắt đầu kiểm tra...\n`);

    const checkTasks = proxies.map(proxy => checkProxy(proxy));
    const results = await Promise.all(checkTasks);

    const liveProxies = results.filter(proxy => proxy !== null);

 
    fs.writeFile("proxy.txt", liveProxies.join("\n"), "utf-8", (err) => {
        if (err) {
            console.error("❌ Lỗi ghi file:", err);
        } else {
            console.log(`✅ Đã lưu ${liveProxies.length} proxy sống vào p.txt`);
        }
    });


    if (liveProxies.length > 0) {
        console.log("\n🟢 Proxy sống:");
        liveProxies.forEach(proxy => console.log(`✅ ${proxy}`));
    } else {
        console.log("\n❌ Không có proxy nào sống!");
    }
}

main();
