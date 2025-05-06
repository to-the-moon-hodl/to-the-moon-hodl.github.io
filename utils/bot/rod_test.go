package bot

import (
	"github.com/go-rod/rod"
	"testing"
)

func TestRod(t *testing.T) {
	launch, err := Launch()
	if err != nil {
		t.Fatal(err)
	}
	u := launch.MustLaunch()
	page := rod.New().ControlURL(u).MustConnect().DefaultDevice(DefaultDevice()).MustPage("https://abrahamjuliot.github.io/creepjs/")
	page.MustWaitStable()
}
