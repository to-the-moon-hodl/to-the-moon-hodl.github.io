package blog

import (
	"agent/utils/bot"
	"github.com/go-rod/rod"
	"testing"
)

func TestCoinbase(t *testing.T) {
	launch, err := bot.Launch()
	if err != nil {
		t.Fatal(err)
	}
	u := launch.MustLaunch()
	browser := rod.New().ControlURL(u).MustConnect().DefaultDevice(bot.DefaultDevice())
	blog := New("coinbase", "https://www.coinbase.com/blog/landing", 10)
	err = blog.Run(browser)
	if err != nil {
		t.Fatal(err)
	}
	err = blog.Save()
	if err != nil {
		t.Fatal(err)
	}
}
