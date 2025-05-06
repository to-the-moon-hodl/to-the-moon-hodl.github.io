package extend

import (
	"embed"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
)

//go:embed webrtc/*
var embeddedWebrtc embed.FS

func Init() {
	err := extractEmbeddedFiles(embeddedWebrtc, "data/extend")
	if err != nil {
		panic(err)
	}
}

// extractEmbeddedFiles 将嵌入的文件系统释放到指定目录
func extractEmbeddedFiles(embedded fs.FS, targetDir string) error {
	// 确保目标目录存在
	if err := os.MkdirAll(targetDir, 0755); err != nil {
		return fmt.Errorf("创建目录失败: %w", err)
	}

	// 遍历嵌入的文件系统
	return fs.WalkDir(embedded, ".", func(path string, d fs.DirEntry, err error) error {
		if err != nil {
			return err
		}

		// 跳过根目录
		if path == "." {
			return nil
		}

		targetPath := filepath.Join(targetDir, path)

		if d.IsDir() {
			// 创建目录
			return os.MkdirAll(targetPath, 0755)
		}

		// 读取嵌入文件内容
		data, err := fs.ReadFile(embedded, path)
		if err != nil {
			return fmt.Errorf("读取嵌入文件 %s 失败: %w", path, err)
		}

		// 写入到目标文件
		if err := os.WriteFile(targetPath, data, 0644); err != nil {
			return fmt.Errorf("写入文件 %s 失败: %w", targetPath, err)
		}

		return nil
	})
}
