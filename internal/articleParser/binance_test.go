package articleParser

import (
	"agent/utils/bot"
	"github.com/go-rod/rod"
	"testing"
)

func TestBinanceParser(t *testing.T) {
	launch, err := bot.Launch()
	if err != nil {
		t.Fatal(err)
	}
	u := launch.MustLaunch()
	page := rod.New().ControlURL(u).MustConnect().DefaultDevice(bot.DefaultDevice()).MustPage("https://www.binance.com/en/blog/futures/crypto-futures-trading-a-beginners-guide-6691785677754277146")
	page.MustWaitStable()
	res, err := binanceParser(page)
	if err != nil {
		t.Fatal(err)
	}
	if res.Url != "https://www.binance.com/en/blog/futures/crypto-futures-trading-a-beginners-guide-6691785677754277146" {
		t.Fatalf("expected url to be 'https://www.binance.com/en/blog/futures/crypto-futures-trading-a-beginners-guide-6691785677754277146', got '%s'", res.Url)
	}
	if res.Title != "Crypto Futures Trading: A Beginner’s Guide" {
		t.Fatalf("expected title to be 'Crypto Futures Trading: A Beginner's Guide', got '%s'", res.Title)
	}
	if res.Author != "binance" {
		t.Fatalf("expected author to be 'binance', got '%s'", res.Author)
	}
	if res.Content == "" {
		t.Fatalf("expected content to be not empty")
	}
	if res.ImageURL != "https://public.bnbstatic.com/image/cms/blog/20250401/a4f9035b-752e-4bc1-a460-8e935e1130fb" {
		t.Fatalf("expected image url to be 'https://public.bnbstatic.com/image/cms/blog/20250401/a4f9035b-752e-4bc1-a460-8e935e1130fb', got '%s'", res.ImageURL)
	}
}
