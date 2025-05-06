import { useEffect, useState } from 'react'

import { Link, routes, useParams } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import styles from './ArticlesPage.module.css'

interface Article {
  url: string
  title: string
  author: string
  excerpt: string
  publishDate: string
  image_url: string
  source?: 'binance' | 'coinbase'
}

interface ArticleData {
  name: string
  begin_url: string
  limit: number
  article_url_map: {
    [key: string]: Article
  }
}

type ArticleWithSource = Article & { source: 'binance' | 'coinbase' }

const ArticlesPage = () => {
  const { source } = useParams()
  const [articles, setArticles] = useState<ArticleWithSource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [articlesPerPage, setArticlesPerPage] = useState(6)

  // 根据source参数确定标题和数据源
  const getSourceInfo = () => {
    const validSources = ['binance', 'coinbase']
    const normalizedSource = source?.toLowerCase() || 'all'

    if (!source || !validSources.includes(normalizedSource)) {
      return {
        title: '全部文章列表',
        description: 'Binance和Coinbase的文章列表',
        dataSource: 'all'
      }
    }

    return {
      title: `${normalizedSource === 'binance' ? 'Binance' : 'Coinbase'}文章列表`,
      description: `${normalizedSource === 'binance' ? 'Binance' : 'Coinbase'}的文章列表`,
      dataSource: normalizedSource as 'binance' | 'coinbase'
    }
  }

  const sourceInfo = getSourceInfo()

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const dataSource = sourceInfo.dataSource
        let allArticles: ArticleWithSource[] = []

        // 根据数据源获取相应的文章
        if (dataSource === 'all' || dataSource === 'binance') {
          const binanceResponse = await fetch('/binance.json')
          if (binanceResponse.ok) {
            const binanceData: ArticleData = await binanceResponse.json()
            const binanceArticles = Object.values(binanceData.article_url_map).map(
              article => ({ ...article, source: 'binance' as const })
            )
            allArticles = [...allArticles, ...binanceArticles]
          }
        }

        if (dataSource === 'all' || dataSource === 'coinbase') {
          const coinbaseResponse = await fetch('/coinbase.json')
          if (coinbaseResponse.ok) {
            const coinbaseData: ArticleData = await coinbaseResponse.json()
            const coinbaseArticles = Object.values(coinbaseData.article_url_map).map(
              article => ({ ...article, source: 'coinbase' as const })
            )
            allArticles = [...allArticles, ...coinbaseArticles]
          }
        }

        // 按发布日期排序
        allArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
        setArticles(allArticles)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : '发生未知错误')
        setLoading(false)
      }
    }

    fetchArticles().then(_ => {})
    // 当source改变时重新获取数据
  }, [sourceInfo.dataSource])

  // 计算当前页面显示的文章
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle)
  const totalPages = Math.ceil(articles.length / articlesPerPage)

  // 页面变化处理
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // 每页文章数量变化处理
  const handleArticlesPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setArticlesPerPage(Number(e.target.value))
    setCurrentPage(1) // 重置回第一页
  }

  // 切换数据源
  const handleSourceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSource = e.target.value
    if (newSource === 'all') {
      window.location.href = routes.articles()
    } else {
      window.location.href = `/articles/${newSource}`
    }
  }

  // 渲染页码
  const renderPageNumbers = () => {
    const pageNumbers = []
    let startPage = Math.max(1, currentPage - 2)
    const endPage = Math.min(totalPages, startPage + 4)

    // 调整开始页码，确保显示5个页码（如果有足够多的页）
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4)
    }

    if (startPage > 1) {
      pageNumbers.push(
        <button key="first" onClick={() => handlePageChange(1)} className={styles.pageNumber}>
          1
        </button>
      )
      if (startPage > 2) {
        pageNumbers.push(<span key="dots1" className={styles.pageDots}>...</span>)
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`${styles.pageNumber} ${currentPage === i ? styles.active : ''}`}
        >
          {i}
        </button>
      )
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(<span key="dots2" className={styles.pageDots}>...</span>)
      }
      pageNumbers.push(
        <button
          key="last"
          onClick={() => handlePageChange(totalPages)}
          className={styles.pageNumber}
        >
          {totalPages}
        </button>
      )
    }

    return pageNumbers
  }

  return (
    <>
      <Metadata title={sourceInfo.title} description={sourceInfo.description} />

      <h1>{sourceInfo.title}</h1>

      <div className="page-nav">
        <Link to={routes.home()} className="nav-link">
          返回首页
        </Link>
      </div>

      {loading && <p className="loading">正在加载文章...</p>}
      {error && <p className="error">错误: {error}</p>}

      {!loading && !error && (
        <>
          <div className={styles.pageSettings}>
            <div className={styles.settingsGroup}>
              <label htmlFor="sourceSelect">数据源: </label>
              <select
                id="sourceSelect"
                value={sourceInfo.dataSource}
                onChange={handleSourceChange}
                className={styles.sourceSelect}
              >
                <option value="all">全部</option>
                <option value="binance">Binance</option>
                <option value="coinbase">Coinbase</option>
              </select>
            </div>

            <div className={styles.settingsGroup}>
              <label htmlFor="articlesPerPage">每页显示文章数: </label>
              <select
                id="articlesPerPage"
                value={articlesPerPage}
                onChange={handleArticlesPerPageChange}
                className={styles.articlesPerPageSelect}
              >
                <option value="6">6</option>
                <option value="12">12</option>
                <option value="15">15</option>
                <option value="24">24</option>
              </select>
            </div>
          </div>

          <div className={styles.articlesContainer}>
            {currentArticles.length === 0 ? (
              <p>没有找到文章</p>
            ) : (
              currentArticles.map((article, index) => (
                <div key={index} className={styles.articleCard}>
                  {article.image_url && (
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className={styles.articleImage}
                    />
                  )}
                  <div className={styles.articleContent}>
                    <div className={styles.articleSource}>
                      来源: {article.source === 'binance' ? 'Binance' : 'Coinbase'}
                    </div>
                    <h2 className={styles.articleTitle}>{article.title}</h2>
                    <p className={styles.articleAuthor}>作者: {article.author}</p>
                    <p className={styles.articleDate}>
                      发布日期:{' '}
                      {new Date(article.publishDate).toLocaleDateString('zh-CN')}
                    </p>
                    <p className={styles.articleExcerpt}>{article.excerpt}</p>
                    <Link
                      to={routes.articleDetail({
                        url: encodeURIComponent(article.url),
                      })}
                      className={styles.articleLink}
                    >
                      阅读更多
                    </Link>
                  </div>
                </div>
              ))
            )}

            {articles.length > 0 && (
              <div className={styles.paginationContainer}>
                <div className={styles.pagination}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={styles.pageButton}
                  >
                    上一页
                  </button>
                  {renderPageNumbers()}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={styles.pageButton}
                  >
                    下一页
                  </button>
                </div>
                <div className={styles.pageInfo}>
                  第 {currentPage} 页 / 共 {totalPages} 页
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  )
}

export default ArticlesPage
