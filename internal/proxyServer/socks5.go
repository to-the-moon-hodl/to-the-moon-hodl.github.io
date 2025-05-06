package proxyServer

import (
	"context"
	"errors"
	"fmt"
	"github.com/things-go/go-socks5"
	"golang.org/x/net/proxy"
	"log"
	"net"
	"net/url"
	"os"
	"time"
)

func Server(user, password, address string, port int) error {
	// 设置 SOCKS5 代理地址
	proxyURL, err := url.Parse(fmt.Sprintf("socks5://%s:%s@%s", user, password, address))
	if err != nil {
		return err
	}
	// 创建 SOCKS5 拨号器
	dialer, err := proxy.FromURL(proxyURL, proxy.Direct)
	if err != nil {
		return err
	}
	_, err = dialer.Dial("tcp", "1.1.1.1:80")
	if err != nil {
		return errors.New("proxy dial test error:" + err.Error())
	}
	resolver := NewDNSResolver(dialer, "https://cloudflare-dns.com/dns-query")
	// 创建 SOCKS5 服务器配置
	server := socks5.NewServer(
		socks5.WithLogger(socks5.NewLogger(log.New(os.Stdout, "socks5: ", log.LstdFlags))),
		socks5.WithDial(func(ctx context.Context, network, addr string) (net.Conn, error) {
			return dialer.Dial(network, addr)
		}),
		socks5.WithResolver(&resolver),
	)

	// 创建监听器
	listener, err := net.Listen("tcp", fmt.Sprintf("127.0.0.1:%d", port))
	if err != nil {
		return err
	}
	// 创建错误通道
	errChan := make(chan error, 1)

	// 启动服务器协程
	go func() {
		log.Println(fmt.Sprintf("SOCKS5 proxy server starting on 127.0.0.1:%d", port))
		errChan <- server.Serve(listener)
	}()

	// 等待3秒或错误
	select {
	case err = <-errChan:
		return err
	case <-time.After(3 * time.Second):
		log.Println("SOCKS5 proxy server started successfully (3s no error)")
		return nil
	}
}
