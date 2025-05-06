package bot

import (
	"agent/internal/proxyServer"
	"agent/utils/mooproxy"
	"errors"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/devices"
	"github.com/go-rod/rod/lib/launcher"
	"math/rand"
	"os"
	"runtime"
	"strings"
	"time"
)

func CF(page *rod.Page) error {
	inPage := false
	for i := 0; i < 3; i++ {
		if strings.Contains(page.MustInfo().Title, "Just a moment") {
			err := page.Reload()
			if err != nil {
				return err
			}
			time.Sleep(time.Second * time.Duration(rand.Intn(10)+1))
		} else {
			inPage = true
		}
	}
	if !inPage {
		return fmt.Errorf("cf waf")
	}
	return nil
}
func ua() string {
	version := "135.0.0.0"
	switch runtime.GOOS {
	case "windows":
		return fmt.Sprintf("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36", version)
	case "darwin":
		return fmt.Sprintf("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36", version)
	case "linux":
		return fmt.Sprintf("Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/%s Safari/537.36", version)
	}
	return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
}
func DefaultDevice() devices.Device {
	return devices.Device{
		Capabilities:   []string{},
		UserAgent:      ua(),
		AcceptLanguage: "en-US,en;q=0.9",
		Screen: devices.Screen{
			DevicePixelRatio: 1,
			Horizontal: devices.ScreenSize{
				Width:  1920,
				Height: 1080,
			},
			Vertical: devices.ScreenSize{
				Width:  1080,
				Height: 1920,
			},
		},
		Title: "Chrome",
	}
}
func ElementXTry(page *rod.Page, xpath string, try int, interval time.Duration) (*rod.Element, error) {
	if try == 0 {
		try = 3
	}
	if interval == 0 {
		interval = time.Second
	}
	for i := 0; i < try; i++ {
		el, err := page.ElementX(xpath)
		if err == nil {
			return el, nil
		}
		time.Sleep(interval)
	}
	return nil, errors.New("element not found")
}
func XVFB(l *launcher.Launcher) *launcher.Launcher {
	if runtime.GOOS == "linux" {
		return l.XVFB("--server-num=5", "--server-args=-screen 0 1920x1080x16")
	}
	return l
}
func Launch() (*launcher.Launcher, error) {
	port := rand.Intn(64535) + 1024
	proxyUser := os.Getenv("PROXY_USER")
	proxyPassword := os.Getenv("PROXY_PASSWORD")
	proxyAddress := os.Getenv("PROXY_ADDRESS")
	//获取代理
	if proxyUser == "" {
		auth, addr, err := mooproxy.Get(os.Getenv("MOOPROXY_USER"), os.Getenv("MOOPROXY_PASSWORD"), os.Getenv("MOOPROXY_CODE"))
		if err != nil {
			return nil, err
		}
		proxyUser = auth.User
		proxyPassword = auth.Password
		proxyAddress = addr
	}
	l := launcher.New().
		Leakless(true).
		Headless(false).
		Set("disable-default-apps").
		Set("no-first-run").
		Set("disable-gpu")
	if proxyUser != "" {
		err := proxyServer.Server(proxyUser, proxyPassword, proxyAddress, port)
		if err != nil {
			return nil, err
		}
		l = l.Proxy(fmt.Sprintf("socks5://127.0.0.1:%d", port))
	}
	return XVFB(l), nil
}
