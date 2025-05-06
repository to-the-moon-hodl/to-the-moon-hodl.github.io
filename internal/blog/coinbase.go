package blog

import (
	"agent/utils/bot"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/go-rod/rod/lib/proto"
	"log"
	"math/rand"
	"net/url"
	"time"
)

type DATA struct {
	Items []struct {
		Fields struct {
			Name  string `json:"name"`
			Title string `json:"title"`
			Slug  string `json:"slug"`
			Seo   struct {
				Sys struct {
					Type     string `json:"type"`
					LinkType string `json:"linkType"`
					Id       string `json:"id"`
				} `json:"sys"`
			} `json:"seo"`
			Content struct {
				Sys struct {
					Type     string `json:"type"`
					LinkType string `json:"linkType"`
					Id       string `json:"id"`
				} `json:"sys"`
			} `json:"content"`
			PublicationDate string `json:"publicationDate"`
		} `json:"fields"`
	} `json:"items"`
}

func (b *Blog) coinbase(browser *rod.Browser) error {
	defer func() {
		if err := recover(); err != nil {
			log.Println("coinbase list panic:", err)
		}
	}()
	//for i := 0; i < 10; i++ {
	//	istr := fmt.Sprintf("%d", 1050+i*20)
	//	resp, err := http.Get("https://contentful.coinbase.com/spaces/coinbaseblog/environments/master/entries?include=10&locale=&content_type=page&fields.content.sys.contentType.sys.id=cdxTemplateEditorialPage&metadata.tags.sys.id%5Ball%5D=productsBlog&fields.content.fields.tags.sys.id%5Bin%5D=53qmfjwQYqt9lAB6vdaUgh%2C3vrQR5SGU1qwVah8qjwS8Y%2C56o574LwXymA4QscO6N0mZ%2C6pJmNg16cShjnLXoy8zbwT%2C5N5aEvqZM6LqN2PiVdwcR&fields.slug%5Bnin%5D=%2Fblog%2Flanding&order=fields.publicationDate&limit=20&skip=" + istr)
	//	if err != nil {
	//		continue
	//	}
	//	var data DATA
	//	all, err := io.ReadAll(resp.Body)
	//	if err != nil {
	//		continue
	//	}
	//	err = resp.Body.Close()
	//	if err != nil {
	//		continue
	//	}
	//	err = json.Unmarshal(all, &data)
	//	if err != nil {
	//		continue
	//	}
	//	for _, item := range data.Items {
	//		item.Fields.Slug = fmt.Sprintf("https://www.coinbase.com%s", item.Fields.Slug)
	//		b.queue <- item.Fields.Slug
	//	}
	//}
	//return nil
	urlSet := make(map[string]bool)
	_url, err := url.Parse(b.BeginUrl)
	if err != nil {
		return err
	}
	//加载文章列表
	page := browser.MustPage(b.BeginUrl)
	page.Timeout(time.Second * 30).MustWaitStable().CancelTimeout()
	defer page.MustClose()
	err = bot.CF(page)
	if err != nil {
		return err
	}
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
	//倒叙
	//el, err := bot.ElementXTry(page, "//button[contains(@data-qa, 'HeroTertiary')]", 5, time.Second)
	//if err != nil {
	//	return err
	//}
	//el.MustClick()
	//time.Sleep(time.Second)
	//el, err = bot.ElementXTry(page, "//p[text()='oldest']", 5, time.Second)
	//if err != nil {
	//	return err
	//}
	//el.MustClick()
	//time.Sleep(time.Second)
	//page.MustWaitStable()
	//翻页
	time.Sleep(time.Second * 3)
	pageNum := 1
	for b.limitAtomic.Load() > 0 {
		if page.MustHasX("//span[text()='Show more']/../../..") {
			bt := page.MustElementX("//span[text()='Show more']/../../..")
			for range rand.Intn(10) + 3 {
				page.Mouse.MustScroll(0, float64(rand.Intn(300)+100))
				time.Sleep(time.Millisecond * time.Duration(rand.Intn(300)+100))
			}
			time.Sleep(time.Millisecond * time.Duration(rand.Intn(300)+100))
			bt.MustScrollIntoView().MustClick()
			time.Sleep(time.Millisecond * time.Duration(rand.Intn(300)+100))
			pageNum++
		} else {
			log.Println("coinbase no more page")
			break
		}
		log.Println("coinbase page:", pageNum)
		for _, result := range page.MustElementsX("//div[@data-qa='CardGrid']//a[starts-with(@href, '/blog')]//img/../../..") {
			if b.limitAtomic.Load() > 0 {
				getUrl := *result.MustAttribute("href")
				articleUrl := fmt.Sprintf("%s://%s%s", _url.Scheme, _url.Host, getUrl)
				if articleUrl == "https://www.coinbase.com/blog/on-insurance-and-cryptocurrency" {
					continue
				}
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
		time.Sleep(time.Second * time.Duration(rand.Intn(10)+3))
	}
	log.Println("coinbase list end", b.limitAtomic.Load())
	return nil
}
