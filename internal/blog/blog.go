package blog

import (
	"agent/internal/articleParser"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-rod/rod"
	"github.com/sagernet/sing/common/atomic"
	"log"
	"math/rand"
	"os"
	"sync"
	"time"
)

type Blog struct {
	Name          string                                `json:"name"`
	BeginUrl      string                                `json:"begin_url"`
	Limit         int                                   `json:"limit"`
	ArticleUrlMap map[string]*articleParser.BlogArticle `json:"article_url_map"`
	queue         chan string
	limitAtomic   *atomic.Int64
	wg            sync.WaitGroup
}

func New(name string, beginUrl string, limit int) *Blog {
	limitAtomic := atomic.Int64{}
	limitAtomic.Add(int64(limit))
	m := map[string]*articleParser.BlogArticle{}
	//加载之前的数据
	marshal, err := os.ReadFile(fmt.Sprintf("data/%s.json", name))
	if err == nil {
		blog := Blog{}
		err = json.Unmarshal(marshal, &blog)
		if err != nil {
			log.Println("load blog data error:", err)
		}
		m = blog.ArticleUrlMap
	}
	log.Println("load blog data:", len(m), name)
	return &Blog{
		Name:          name,
		BeginUrl:      beginUrl,
		Limit:         limit,
		ArticleUrlMap: m,
		queue:         make(chan string, 32),
		limitAtomic:   &limitAtomic,
		wg:            sync.WaitGroup{},
	}
}
func (b *Blog) Run(browser *rod.Browser) error {
	go func() {
		b.wg.Add(1)
		defer func() { b.wg.Done() }()
		//爬取文章内容队列执行
		err := b.crawl(browser)
		if err != nil {
			log.Println("blog crawl error:", err)
		}
		log.Println("blog crawl done")
	}()
	b.wg.Add(1)
	defer func() { b.wg.Done() }()
	defer func() {
		close(b.queue)
	}()
	if b.BeginUrl == "" {
		return errors.New("begin url is empty")
	}
	//爬取博客文章url列表
	switch b.Name {
	case "coinbase":
		return b.coinbase(browser)
	case "binance":
		return b.binance(browser)
	default:
		return errors.New("unknown blog")
	}
}

func (b *Blog) Save() error {
	b.wg.Wait()
	//保存
	marshal, err := json.Marshal(b)
	if err != nil {
		return err
	}
	_, err = os.Stat("data")
	if err != nil {
		err = os.Mkdir("data", 0755)
	}
	log.Println("save blog data:", len(b.ArticleUrlMap), b.Name)
	return os.WriteFile(fmt.Sprintf("data/%s.json", b.Name), marshal, 0644)
}

func (b *Blog) crawl(browser *rod.Browser) error {
	defer func() {
		if err := recover(); err != nil {
			log.Println("crawl panic:", err)
		}
	}()
	parser := articleParser.RegParser[b.Name]
	taskNum := atomic.Int64{}
	num := atomic.Int64{}
	for url := range b.queue {
		if b.ArticleUrlMap[url] != nil {
			continue
		}
		time.Sleep(time.Millisecond * time.Duration(rand.Intn(1000)+100))
		for {
			if taskNum.Load() < 3 {
				taskNum.Add(1)
				break
			}
			time.Sleep(time.Second)
		}
		go func() {
			defer func() {
				if err := recover(); err != nil {
					log.Println("load page panic:", err)
				}
			}()
			defer taskNum.Add(-1)
			num.Add(1)
			log.Println("start crawl article url:", url, num.Load())
			//每次收到文章url,新开标签进行爬取
			page := browser.MustPage(url)
			defer page.MustClose()
			page.Timeout(time.Second * 30).MustWaitStable().CancelTimeout()
			article, err := parser(page)
			if err != nil {
				log.Println("parse article url ", url, " error:", err)
				return
			}
			b.ArticleUrlMap[url] = article
		}()
	}
	for taskNum.Load() > 0 {
		time.Sleep(time.Second)
	}
	return nil
}
