package articleParser

import (
	"bytes"
	"github.com/PuerkitoBio/goquery"
	"github.com/go-rod/rod"
	"log"
	"time"
)

func binanceParser(page *rod.Page) (*BlogArticle, error) {
	defer func() {
		if err := recover(); err != nil {
			log.Println("binanceParser url:"+page.MustInfo().URL+" panic:", err)
		}
	}()
	//获取文章标题
	page = page.Timeout(30 * time.Second)
	title, err := page.ElementX("//h1[contains(@class, 'ib-page-title')]")
	if err != nil {
		return nil, err
	}
	//获取发布时间
	dateEl, err := page.ElementX("//h1[contains(@class, 'ib-page-title')]/../div/div")
	if err != nil {
		return nil, err
	}
	publishDateTime, err := time.Parse(time.DateOnly, dateEl.MustText())
	if err != nil {
		return nil, err
	}
	//获取文章图片
	var imageURL = ""
	if page.MustHasX(`(//div[contains(@class, 'richtext-container')]//img)[1]`) {
		imageURL = *page.MustElementX(`(//div[contains(@class, 'richtext-container')]//img)[1]`).MustAttribute("src")
	}
	//获取文章摘要
	var excerpt = ""
	if page.MustHasX("//h2[@id='Main-Takeaways']/following-sibling::*[1]") {
		excerpt = page.MustElementX("//h2[@id='Main-Takeaways']/following-sibling::*[1]").MustText()
	}
	//获取文章正文
	contentEl, err := page.ElementX("//div[contains(@class, 'richtext-container')]")
	if err != nil {
		return nil, err
	}
	doc, err := goquery.NewDocumentFromReader(bytes.NewReader([]byte(contentEl.MustHTML())))
	if err != nil {
		return nil, err
	}
	return &BlogArticle{
		Url:         page.MustInfo().URL,
		Title:       title.MustText(),
		Author:      "binance",
		Content:     cleanHTML(doc.First()),
		Excerpt:     excerpt,
		PublishDate: publishDateTime,
		ImageURL:    imageURL,
	}, nil
}
