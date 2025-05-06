package articleParser

import (
	"agent/utils/bot"
	"github.com/go-rod/rod"
	"testing"
)

func TestCoinbaseParser(t *testing.T) {
	launch, err := bot.Launch()
	if err != nil {
		t.Fatal(err)
	}
	u := launch.MustLaunch()
	page := rod.New().ControlURL(u).MustConnect().DefaultDevice(bot.DefaultDevice()).MustPage("https://www.coinbase.com/blog/navigating-crypto-taxes-in-canada-what-you-need-to-know-this-season")
	page.MustWaitStable()
	res, err := coinbaseParser(page)
	if err != nil {
		t.Fatal(err)
	}
	if res.Url != "https://www.coinbase.com/blog/navigating-crypto-taxes-in-canada-what-you-need-to-know-this-season" {
		t.Fatalf("expected url to be 'https://www.coinbase.com/blog/navigating-crypto-taxes-in-canada-what-you-need-to-know-this-season', got '%s'", res.Url)
	}
	if res.Title != "Navigating Crypto Taxes in Canada: What You Need to Know This Season" {
		t.Fatalf("expected title to be 'Navigating Crypto Taxes in Canada: What You Need to Know This Season', got '%s'", res.Title)
	}
	if res.Author != "Lucas Matheson" {
		t.Fatalf("expected author to be 'Lucas Matheson', got '%s'", res.Author)
	}
	if res.Content == "" {
		t.Fatalf("expected content to be not empty")
	}
	if res.Excerpt != "If you’re reading this, it’s probably that time of year again: tax season. Whether you traded, earned, or simply held onto your crypto, we’re here to break down what you need to know about filing your taxes in Canada." {
		t.Fatalf("expected title to be 'If you’re reading this, it’s probably that time of year again: tax season. Whether you traded, earned, or simply held onto your crypto, we’re here to break down what you need to know about filing your taxes in Canada.', got '%s'", res.Excerpt)
	}
	if res.ImageURL != "https://ctf-images-01.coinbasecdn.net/sygt3q11s4a9/e2tPLbg5XRWqWJWVQv8C9/26e23b34d146495a5746152e44e6f6f3/CA__1_.png" {
		t.Fatalf("expected image url to be 'https://ctf-images-01.coinbasecdn.net/sygt3q11s4a9/e2tPLbg5XRWqWJWVQv8C9/26e23b34d146495a5746152e44e6f6f3/CA__1_.png', got '%s'", res.ImageURL)
	}
}
