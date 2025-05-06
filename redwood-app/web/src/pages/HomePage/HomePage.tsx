import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

import styles from './HomePage.module.css'

const HomePage = () => {
  return (
    <>
      <Metadata
        title="加密货币资讯聚合平台"
        description="汇集Binance和Coinbase的最新加密货币资讯"
      />

      <div className={styles.homeContainer}>
        <header className={styles.homeHeader}>
          <h1 className={styles.siteTitle}>加密货币资讯聚合平台</h1>
          <p className={styles.siteSubtitle}>汇集全球领先交易所的最新动态与分析</p>
        </header>

        <section className={styles.homeIntro}>
          <div className={styles.introContent}>
            <h2>关于我们的平台</h2>
            <p>
              我们主要致力于<strong>加密货币资料收集与聚合</strong>
              ，为加密货币爱好者、投资者和研究人员提供便捷的信息获取渠道。
            </p>
            <p>
              在这个快速发展的加密世界中，及时获取准确信息至关重要。我们的平台自动聚合来自Binance和Coinbase等领先交易所的官方博客内容，
              帮助您掌握行业动态、技术发展和市场趋势。
            </p>
            <p>
              无论您是加密货币新手还是经验丰富的投资者，我们的平台都能为您提供有价值的信息资源，助您做出更明智的决策。
            </p>
          </div>
        </section>

        <section className={styles.exchangesSection}>
          <h2>浏览交易所资讯</h2>
          <div className={styles.exchangeCards}>
            <div className={styles.exchangeCard}>
              <div className={`${styles.exchangeLogo} ${styles.binanceLogo}`}>B</div>
              <div className={styles.exchangeInfo}>
                <h3>Binance</h3>
                <p>
                  全球最大的加密货币交易所，获取最新公告、市场分析和行业动态。
                </p>
                <Link to={'/articles/binance'} className={styles.exchangeLink}>
                  浏览Binance文章 →
                </Link>
              </div>
            </div>

            <div className={styles.exchangeCard}>
              <div className={`${styles.exchangeLogo} ${styles.coinbaseLogo}`}>C</div>
              <div className={styles.exchangeInfo}>
                <h3>Coinbase</h3>
                <p>
                  美国领先的加密货币交易平台，了解最新产品更新、监管见解和市场趋势。
                </p>
                <Link to={'/articles/coinbase'} className={styles.exchangeLink}>
                  浏览Coinbase文章 →
                </Link>
              </div>
            </div>

            <div className={styles.exchangeCard} style={{ backgroundColor: '#f7f7f7' }}>
              <div className={styles.exchangeLogo} style={{ backgroundColor: '#1f6feb' }}>All</div>
              <div className={styles.exchangeInfo}>
                <h3>所有文章</h3>
                <p>
                  浏览所有交易所的文章，获取全面的加密货币市场资讯。
                </p>
                <Link to={routes.articles()} className={styles.exchangeLink}>
                  浏览所有文章 →
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <h2>我们的特色</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📊</div>
              <h3>实时聚合</h3>
              <p>自动获取最新发布的官方博客文章，确保信息时效性。</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🔍</div>
              <h3>便捷浏览</h3>
              <p>清晰的分类和直观的界面，让您轻松找到所需信息。</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>📱</div>
              <h3>响应式设计</h3>
              <p>在任何设备上都能获得良好的阅读体验。</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🌐</div>
              <h3>中文支持</h3>
              <p>提供中文界面，降低语言障碍，方便中文用户使用。</p>
            </div>
          </div>
        </section>

        <footer className={styles.homeFooter}>
          <p>
            © 2025 加密货币资讯聚合平台 | 本站仅作为信息聚合，不构成投资建议
          </p>
        </footer>
      </div>
    </>
  )
}

export default HomePage
