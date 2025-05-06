package articleParser

import (
	"agent/utils/bot"
	"bytes"
	"errors"
	"github.com/PuerkitoBio/goquery"
	"github.com/go-rod/rod"
	"github.com/tidwall/gjson"
	"log"
	"strings"
	"time"
)

func coinbaseParser(page *rod.Page) (*BlogArticle, error) {
	defer func() {
		if err := recover(); err != nil {
			log.Println("coinbaseParser url:"+page.MustInfo().URL+" panic:", err)
		}
	}()
	err := bot.CF(page)
	if err != nil {
		return nil, err
	}
	page = page.Timeout(30 * time.Second)
	if page.MustInfo().Title == "Coinbase Blog" || page.MustInfo().Title == "404" {
		return nil, errors.New("404")
	}
	//获取文章标题
	title := ""
	titleEl, err := page.ElementX("//h1[@variant='display2']")
	if err != nil {
		return nil, err
	}
	title = titleEl.MustText()
	//获取文章作者
	author := ""
	authorEl, err := page.ElementX("//p[@variant='legal' and contains(text(), 'By')]")
	if err != nil {
		return nil, err
	}
	author = authorEl.MustText()
	//获取文章摘要
	excerpt := ""
	if page.MustHasX("//h1[@variant='display2']/../div[2]") {
		excerpt = page.MustElementX("//h1[@variant='display2']/../div[1]").MustText()
	}
	//获取发布时间
	nextData, err := page.Element("#__NEXT_DATA__")
	if err != nil {
		return nil, err
	}
	dateStr := gjson.Parse(nextData.MustText()).Get("props.pageProps.page.publicationDate").String()
	publishDateTime, err := time.Parse("2006-01-02T15:04-07:00", dateStr)
	if err != nil {
		return nil, err
	}
	//获取文章封面
	imageURL := ""
	if page.MustHasX("//div[@data-qa='TwoColumnContainerRight']//img") {
		imageURL = *page.MustElementX("//div[@data-qa='TwoColumnContainerRight']//img").MustAttribute("src")
	}
	//获取文章正文
	content := ""
	contentEl, err := page.ElementX("//div[@id='article_introduction']/../../../../section//div[@id='article_introduction']")
	if err == nil {
		doc, err2 := goquery.NewDocumentFromReader(bytes.NewReader([]byte(contentEl.MustHTML())))
		if err2 != nil {
			return nil, err2
		}
		content = cleanHTML(doc.First())
	}

	return &BlogArticle{
		Url:         page.MustInfo().URL,
		Title:       title,
		Author:      strings.ReplaceAll(author, "By ", ""),
		Content:     content,
		Excerpt:     excerpt,
		PublishDate: publishDateTime,
		ImageURL:    imageURL,
	}, nil
}
