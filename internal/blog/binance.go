package blog

import (
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"log"
	"math/rand"
	"net/url"
	"time"
)

func (b *Blog) binance(browser *rod.Browser) error {
	defer func() {
		if err := recover(); err != nil {
			log.Println("binance list panic:", err)
		}
	}()
	urlSet := make(map[string]bool)
	_url, err := url.Parse(b.BeginUrl)
	if err != nil {
		return err
	}
	//加载文章列表
	page := browser.MustPage(b.BeginUrl)
	page.Timeout(time.Second * 30).MustWaitStable().CancelTimeout()
	defer page.MustClose()
	//阻止加载图片
	router := page.HijackRequests()
	doFunc := func(ctx *rod.Hijack) {
		if ctx.Request.Type() == proto.NetworkResourceTypeImage {
			ctx.Response.Fail(proto.NetworkErrorReasonBlockedByClient)
			return
		}
		ctx.ContinueRequest(&proto.FetchContinueRequest{})
	}
	router.MustAdd("*.png", doFunc)
	router.MustAdd("*.jpg", doFunc)
	router.MustAdd("*.jpeg", doFunc)
	go router.Run()
	//翻页
	for b.limitAtomic.Load() > 0 {
		for range rand.Intn(10) + 3 {
			time.Sleep(time.Millisecond * time.Duration(rand.Intn(300)+100))
			if !page.MustHasX(`//div[@class='css-za4ge4']`) {
				page.Mouse.MustScroll(0, float64(rand.Intn(300)+100))
			}
		}
		time.Sleep(time.Millisecond * time.Duration(rand.Intn(1000)+100))
		for _, result := range page.MustElementsX("//div[@class='infinite-scroll-component__outerdiv']/div/div/a") {
			if b.limitAtomic.Load() > 0 {
				getUrl := *result.MustAttribute("href")
				articleUrl := fmt.Sprintf("%s://%s%s", _url.Scheme, _url.Host, getUrl)
				if urlSet[articleUrl] {
					continue
				}
				//把文章url加入队列
				b.queue <- articleUrl
				urlSet[getUrl] = true
				b.limitAtomic.Add(-1)
				log.Println("add article url:", articleUrl, b.limitAtomic.Load())
			}
		}
	}
	log.Println("binance list end", b.limitAtomic.Load())
	return nil
}
