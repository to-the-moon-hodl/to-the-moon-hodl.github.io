package mooproxy

import (
	"bytes"
	"encoding/json"
	"errors"
	"fmt"
	"golang.org/x/net/proxy"
	"io"
	"net/http"
	"sort"
	"strings"
)

type payload struct {
	Username   string `json:"username"`
	Password   string `json:"password"`
	Country    string `json:"country"`
	State      string `json:"state"`
	City       string `json:"city"`
	Amount     int    `json:"amount"`
	CheckScore bool   `json:"check_score"`
	CheckTLS   bool   `json:"check_tls"`
	Provider   string `json:"provider"`
}
type res struct {
	Proxies []Proxy `json:"proxies"`
}
type Proxy struct {
	Proxy string  `json:"proxy"`
	Ip    string  `json:"ip"`
	Score float64 `json:"score"`
}

func Get(user, pass, code string) (*proxy.Auth, string, error) {
	data := payload{
		Username:   user,
		Password:   pass,
		Country:    code,
		State:      "无需大州",
		City:       "无需城市",
		Amount:     3,
		CheckScore: true,
		CheckTLS:   false,
		Provider:   "mooproxy",
	}
	payloadBytes, err := json.Marshal(data)
	if err != nil {
		return nil, "", err
	}
	body := bytes.NewReader(payloadBytes)
	req, err := http.NewRequest("POST", "https://api.mooproxy.xyz/v1/api/generate_proxies", body)
	if err != nil {
		return nil, "", err
	}
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Accept-Language", "zh-CN,zh;q=0.9")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Origin", "https://api.mooproxy.xyz")
	req.Header.Set("Priority", "u=1, i")
	req.Header.Set("Referer", "https://api.mooproxy.xyz/")
	req.Header.Set("Sec-Ch-Ua", "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"")
	req.Header.Set("Sec-Ch-Ua-Mobile", "?0")
	req.Header.Set("Sec-Ch-Ua-Platform", "\"Windows\"")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Site", "same-origin")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, "", err
	}
	defer func() { _ = resp.Body.Close() }()
	all, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, "", err
	}
	var r res
	err = json.Unmarshal(all, &r)
	if err != nil {
		return nil, "", err
	}
	if len(r.Proxies) == 0 {
		return nil, "", errors.New("no proxies")
	}
	sort.Slice(r.Proxies, func(i, j int) bool {
		return r.Proxies[i].Score < r.Proxies[j].Score
	})
	split := strings.Split(r.Proxies[0].Proxy, ":")
	return &proxy.Auth{
		User:     split[2],
		Password: split[3],
	}, fmt.Sprintf("%s:%s", split[0], split[1]), nil
}
