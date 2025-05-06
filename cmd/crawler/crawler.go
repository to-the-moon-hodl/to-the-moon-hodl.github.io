package main

import (
	"agent/extend"
	"agent/internal/blog"
	"agent/internal/proxyServer"
	"agent/utils/bot"
	"agent/utils/mooproxy"
	"crypto/md5"
	"flag"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/launcher"
	"log"
	"os"
	"time"
)

var target string

func main() {
	flag.StringVar(&target, "target", "coinbase", "target blog name")
	flag.Parse()
	log.SetFlags(log.LstdFlags | log.Lshortfile)
	log.SetOutput(os.Stdout)
	//初始化释放插件
	extend.Init()
	dir, _ := os.Getwd()
	proxyUser := os.Getenv("PROXY_USER")
	proxyPassword := os.Getenv("PROXY_PASSWORD")
	proxyAddress := os.Getenv("PROXY_ADDRESS")
	//获取代理
	if proxyUser == "" {
		auth, addr, err := mooproxy.Get(os.Getenv("MOOPROXY_USER"), os.Getenv("MOOPROXY_PASSWORD"), os.Getenv("MOOPROXY_CODE"))
		if err != nil {
			log.Println("get proxy error:", err)
			return
		}
		proxyUser = auth.User
		proxyPassword = auth.Password
		proxyAddress = addr
	}
	err := proxyServer.Server(proxyUser, proxyPassword, proxyAddress, 5080)
	if err != nil {
		log.Println("proxy server error:", err)
		return
	}
	//初始化浏览器
	l := launcher.New().
		Proxy("socks5://127.0.0.1:5080").
		Leakless(true).
		UserDataDir(fmt.Sprintf("data/%x", md5.Sum([]byte(fmt.Sprint(proxyAddress, proxyUser, proxyPassword))))).
		Set("disable-default-apps").
		Set("no-first-run").
		Set("load-extension", dir+"/data/extend/webrtc").
		Set("disable-gpu")
	launchUrl, err := l.Launch()
	if err != nil {
		log.Println("launch browser error:", err)
		return
	}
	browser := rod.New().ControlURL(launchUrl).DefaultDevice(bot.DefaultDevice())
	err = browser.Connect()
	if err != nil {
		log.Println("connect browser error:", err)
		return
	}
	//初始化需要爬取的博客
	var _blog *blog.Blog
	if target == "binance" {
		_blog = blog.New("binance", "https://www.binance.com/en/blog", 24)
	} else {
		_blog = blog.New("coinbase", "https://www.coinbase.com/blog/landing", 24)
	}
	//开始爬取
	go func() {
		err = _blog.Run(browser)
		if err != nil {
			log.Println("run blog error:", err)
		}
	}()
	time.Sleep(time.Second)
	//保存内容
	err = _blog.Save()
	if err != nil {
		log.Println("save blog error:", err)
		return
	}
}
