@echo off
for /f "eol=# delims=" %%i in ('findstr /v "^#" .env') do set %%i
go build -trimpath -ldflags="-s -w" -o crawler.exe cmd/crawler/crawler.go
crawler.exe -rod=show -target=%TARGET%