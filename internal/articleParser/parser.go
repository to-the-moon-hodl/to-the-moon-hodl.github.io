package articleParser

import (
	"bytes"
	"fmt"
	"github.com/PuerkitoBio/goquery"
	"github.com/go-rod/rod"
	"golang.org/x/net/html"
	"io"
	"strings"
	"time"
)

var RegParser = map[string]Parser{
	"coinbase": coinbaseParser,
	"binance":  binanceParser,
}

type Parser func(page *rod.Page) (*BlogArticle, error)

// BlogArticle 博客文章结构体
type BlogArticle struct {
	Url         string    `json:"url"`                 //文章唯一标识
	Title       string    `json:"title"`               // 标题
	Author      string    `json:"author"`              // 作者
	Content     string    `json:"content"`             // 正文内容（HTML）
	Excerpt     string    `json:"excerpt"`             // 摘要
	PublishDate time.Time `json:"publishDate"`         // 发布时间
	ImageURL    string    `json:"image_url,omitempty"` // 头图URL
}

// cleanHTML 清理HTML，保留基本标签和格式
func cleanHTML(selection *goquery.Selection) string {
	// 允许的标签和属性
	allowedTags := map[string][]string{
		"h1":         {},
		"h2":         {},
		"h3":         {},
		"h4":         {},
		"h5":         {},
		"h6":         {},
		"p":          {},
		"br":         {},
		"strong":     {},
		"b":          {},
		"em":         {},
		"i":          {},
		"a":          {"href"},
		"img":        {"src", "alt"},
		"ul":         {},
		"ol":         {},
		"li":         {},
		"blockquote": {},
	}

	var b bytes.Buffer
	selection.Each(func(i int, s *goquery.Selection) {
		// 处理每个节点
		s.Contents().Each(func(_ int, node *goquery.Selection) {
			processNode(&b, node.Get(0), allowedTags)
		})
	})

	// 后处理：确保段落之间有换行
	result := strings.ReplaceAll(b.String(), "</p><p>", "</p>\n\n<p>")
	result = strings.ReplaceAll(result, "</h1><p>", "</h1>\n\n<p>")
	result = strings.ReplaceAll(result, "</h2><p>", "</h2>\n\n<p>")

	return result
}

// processNode 递归处理HTML节点
func processNode(w io.Writer, node *html.Node, allowedTags map[string][]string) {
	switch node.Type {
	case html.TextNode:
		// 写入文本内容，保留原始空格
		_, _ = fmt.Fprint(w, node.Data)
	case html.ElementNode:
		// 检查是否是允许的标签
		if attrs, ok := allowedTags[node.Data]; ok {
			// 开始标签
			_, _ = fmt.Fprintf(w, "<%s", node.Data)

			// 添加允许的属性
			for _, attr := range node.Attr {
				for _, allowedAttr := range attrs {
					if attr.Key == allowedAttr {
						_, _ = fmt.Fprintf(w, ` %s="%s"`, attr.Key, attr.Val)
						break
					}
				}
			}
			_, _ = fmt.Fprint(w, ">")

			// 处理子节点
			for child := node.FirstChild; child != nil; child = child.NextSibling {
				processNode(w, child, allowedTags)
			}

			// 结束标签
			_, _ = fmt.Fprintf(w, "</%s>", node.Data)
		} else {
			// 不允许的标签，只处理其子节点
			for child := node.FirstChild; child != nil; child = child.NextSibling {
				processNode(w, child, allowedTags)
			}
		}
	case html.DocumentNode:
		// 处理文档节点的所有子节点
		for child := node.FirstChild; child != nil; child = child.NextSibling {
			processNode(w, child, allowedTags)
		}
	default:
		return
	}
}
