const axios = require("axios");
const fs = require("fs").promises;

// Danh sách URL proxy
const kami = [
"https://raw.githubusercontent.com/vakhov/fresh-proxy-list/refs/heads/master/https.txt",
"https://raw.githubusercontent.com/vakhov/fresh-proxy-list/refs/heads/master/http.txt",
"https://raw.githubusercontent.com/monosans/proxy-list/refs/heads/main/proxies/http.txt",
"https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/refs/heads/master/http.txt",
"https://raw.githubusercontent.com/Zaeem20/FREE_PROXIES_LIST/refs/heads/master/https.txt",
"https://raw.githubusercontent.com/ErcinDedeoglu/proxies/refs/heads/main/proxies/http.txt",
"https://raw.githubusercontent.com/ErcinDedeoglu/proxies/refs/heads/main/proxies/https.txt",
"https://raw.githubusercontent.com/yemixzy/proxy-list/refs/heads/main/proxies/http.txt",
"https://proxyspace.pro/http.txt",
"https://api.proxyscrape.com/?request=displayproxies&proxytype=http",
"https://www.proxy-list.download/api/v1/get?type=http",
    "https://raw.githubusercontent.com/HyperBeats/proxy-list/main/http.txt",
    "https://raw.githubusercontent.com/HyperBeats/proxy-list/main/https.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies_anonymous/http.txt",
    "http://worm.rip/http.txt",

    "https://api.proxyscrape.com/?request=displayproxies&proxytype=http",
    "https://api.openproxylist.xyz/http.txt",
    "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt",
    "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt",
    "https://raw.githubusercontent.com/opsxcq/proxy-list/master/list.txt",
    "https://proxy-spider.com/api/proxies.example.txt",
    "https://multiproxy.org/txt_all/proxy.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt",
    "https://api.proxyscrape.com/v2/?request=getproxies&protocol=http",
    "https://openproxylist.xyz/http.txt",
    "https://proxyspace.pro/http.txt",
    "https://proxyspace.pro/https.txt",
    "https://raw.githubusercontent.com/almroot/proxylist/master/list.txt",
    "https://raw.githubusercontent.com/aslisk/proxyhttps/main/https.txt",
    "https://raw.githubusercontent.com/B4RC0DE-TM/proxy-list/main/HTTP.txt",
    "https://raw.githubusercontent.com/hendrikbgr/Free-Proxy-Repo/master/proxy_list.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-https.txt",
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/https.txt",
    "https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt",
    "https://raw.githubusercontent.com/saisuiu/uiu/main/free.txt",
    "https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/https.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
    "https://rootjazz.com/proxies/proxies.txt",
    "https://www.proxy-list.download/api/v1/get?type=https",
    "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/http.txt",
    "https://raw.githubusercontent.com/ErcinDedeoglu/proxies/main/proxies/https.txt",
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/http.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/refs/heads/master/https.txt"

];


async function fetchProxies(url) {
    try {
        const response = await axios.get(url);
        return response.data.split("\n").map(proxy => proxy.trim()).filter(proxy => proxy);
    } catch (error) {
        console.error(`Lỗi tải proxy từ ${url}:`, error.message);
        return [];
    }
}

// Lấy proxy từ API riêng
async function getProxyFromAPI() {
    try {
        const response = await axios.get("https://yeuem.online/sex?api=hkscmghssdf");
        if (response.data.code === 0) {
            const http = [
                ...(response.data.data?.http || []),
                ...(response.data.last?.http || [])
            ];
            const socks4 = [
                ...(response.data.data?.socks4 || []),
                ...(response.data.last?.socks4 || [])
            ];
            const socks5 = [
                ...(response.data.data?.socks5 || []),
                ...(response.data.last?.socks5 || [])
            ];
            return { http, socks4, socks5 };
        }
    } catch (error) {
        console.error("Lỗi lấy proxy từ API:", error.message);
    }
    return { http: [], socks4: [], socks5: [] };
}



async function main() {
    const { http, socks4, socks5 } = await getProxyFromAPI();

    // Xóa proxy trùng
    const httpSet = new Set(http);
    const socks4Set = new Set(socks4);
    const socks5Set = new Set(socks5);

    // Ghi file
    await fs.writeFile("http.txt", [...httpSet].join("\n"));
    await fs.writeFile("socks4.txt", [...socks4Set].join("\n"));
    await fs.writeFile("socks5.txt", [...socks5Set].join("\n"));

    console.log(`Đã lưu ${httpSet.size} proxy HTTP vào http.txt`);
    console.log(`Đã lưu ${socks4Set.size} proxy SOCKS4 vào socks4.txt`);
    console.log(`Đã lưu ${socks5Set.size} proxy SOCKS5 vào socks5.txt`);
}

main();
