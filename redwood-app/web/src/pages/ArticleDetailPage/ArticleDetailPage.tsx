import { useEffect, useState } from 'react'

import { Link, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import styles from './ArticleDetailPage.module.css'

interface Article {
  url: string
  title: string
  author: string
  content: string
  publishDate: string
  image_url: string
}

interface ArticleData {
  name: string
  begin_url: string
  limit: number
  article_url_map: {
    [key: string]: Article
  }
}

const ArticleDetailPage = () => {
  const { url } = useParams()
  const decodedUrl = decodeURIComponent(url)

  const [article, setArticle] = useState<Article | null>(null)
  const [source, setSource] = useState<'binance' | 'coinbase' | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        // 先尝试从binance.json获取数据
        let response = await fetch('/binance.json')
        if (!response.ok) {
           new Error('无法获取Binance文章数据')
        }

        let data: ArticleData = await response.json()
        let foundArticle = data.article_url_map[decodedUrl]

        if (foundArticle) {
          setArticle(foundArticle)
          setSource('binance')
          setLoading(false)
          return
        }

        // 如果binance.json中没找到，再尝试从coinbase.json获取
        response = await fetch('/coinbase.json')
        if (!response.ok) {
           new Error('无法获取Coinbase文章数据')
        }

        data = await response.json()
        foundArticle = data.article_url_map[decodedUrl]

        if (foundArticle) {
          setArticle(foundArticle)
          setSource('coinbase')
          setLoading(false)
          return
        }

        // 如果两个来源都没找到文章，则抛出错误
         new Error('文章不存在')
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
        setLoading(false)
      }
    }

    fetchArticleDetail().then(_ => {})
  }, [decodedUrl])

  const getBackLinkRoute = () => {
    if (source === 'binance') {
      return '/articles/binance'
    } else if (source === 'coinbase') {
      return '/articles/coinbase'
    }
    // 默认返回文章列表页面
    return routes.articles()
  }

  const getSourceName = () => {
    if (source === 'binance') {
      return 'Binance'
    } else if (source === 'coinbase') {
      return 'Coinbase'
    }
    return '文章'
  }

  return (
    <>
      <Metadata
        title={article?.title || '文章详情'}
        description={article?.title || '文章详情页面'}
      />

      <div className={styles.articleDetailContainer}>
        <div className="page-nav" style={{ marginBottom: '20px' }}>
          <Link to={routes.home()} className="nav-link">
            返回首页
          </Link>
          <Link
            to={getBackLinkRoute()}
            className="nav-link"
            style={{ marginLeft: '10px' }}
          >
            返回{getSourceName()}文章列表
          </Link>
        </div>

        {loading && <p className="loading">正在加载文章...</p>}
        {error && <p className="error">错误: {error}</p>}

        {!loading && !error && article && (
          <article className={styles.articleDetail}>
            <h1 className={styles.articleTitle}>{article.title}</h1>

            <div className={styles.articleMeta}>
              <p className={styles.articleAuthor}>作者: {article.author}</p>
              <p className={styles.articleDate}>
                发布日期:{' '}
                {new Date(article.publishDate).toLocaleDateString('zh-CN')}
              </p>
            </div>

            {source !== 'binance' && article.image_url && (
              <div className={styles.articleImage}>
                <img
                  src={article.image_url}
                  alt={article.title}
                />
              </div>
            )}

            <div
              className={styles.articleContent}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </article>
        )}
      </div>
    </>
  )
}

export default ArticleDetailPage
