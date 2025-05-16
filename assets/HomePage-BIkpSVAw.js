import { j as jsxRuntimeExports, L as Link, n as namedRoutes } from "./index-DSG9X7hu.js";
import { M as Metadata } from "./Metadata-Dq_7ijNF.js";
const homeContainer = "_homeContainer_197qu_2";
const homeHeader = "_homeHeader_197qu_7";
const siteTitle = "_siteTitle_197qu_13";
const siteSubtitle = "_siteSubtitle_197qu_19";
const homeIntro = "_homeIntro_197qu_26";
const introContent = "_introContent_197qu_34";
const exchangesSection = "_exchangesSection_197qu_46";
const exchangeCards = "_exchangeCards_197qu_57";
const exchangeCard = "_exchangeCard_197qu_57";
const exchangeLogo = "_exchangeLogo_197qu_76";
const binanceLogo = "_binanceLogo_197qu_86";
const coinbaseLogo = "_coinbaseLogo_197qu_90";
const exchangeInfo = "_exchangeInfo_197qu_94";
const exchangeLink = "_exchangeLink_197qu_111";
const featuresSection = "_featuresSection_197qu_124";
const featuresGrid = "_featuresGrid_197qu_135";
const featureItem = "_featureItem_197qu_141";
const featureIcon = "_featureIcon_197qu_149";
const homeFooter = "_homeFooter_197qu_165";
const styles = {
  homeContainer,
  homeHeader,
  siteTitle,
  siteSubtitle,
  homeIntro,
  introContent,
  exchangesSection,
  exchangeCards,
  exchangeCard,
  exchangeLogo,
  binanceLogo,
  coinbaseLogo,
  exchangeInfo,
  exchangeLink,
  featuresSection,
  featuresGrid,
  featureItem,
  featureIcon,
  homeFooter
};
const HomePage = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Metadata, { title: "加密货币资讯聚合平台", description: "汇集Binance和Coinbase的最新加密货币资讯" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.homeContainer, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: styles.homeHeader, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: styles.siteTitle, children: "加密货币资讯聚合平台" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.siteSubtitle, children: "汇集全球领先交易所的最新动态与分析" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: styles.homeIntro, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.introContent, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "关于我们的平台" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "我们主要致力于",
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "加密货币资料收集与聚合" }),
          "，为加密货币爱好者、投资者和研究人员提供便捷的信息获取渠道。"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "在这个快速发展的加密世界中，及时获取准确信息至关重要。我们的平台自动聚合来自Binance和Coinbase等领先交易所的官方博客内容， 帮助您掌握行业动态、技术发展和市场趋势。" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "无论您是加密货币新手还是经验丰富的投资者，我们的平台都能为您提供有价值的信息资源，助您做出更明智的决策。" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.exchangesSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "浏览交易所资讯" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeCards, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.exchangeLogo} ${styles.binanceLogo}`, children: "B" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Binance" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "全球最大的加密货币交易所，获取最新公告、市场分析和行业动态。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/articles/binance", className: styles.exchangeLink, children: "浏览Binance文章 →" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeCard, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `${styles.exchangeLogo} ${styles.coinbaseLogo}`, children: "C" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "Coinbase" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "美国领先的加密货币交易平台，了解最新产品更新、监管见解和市场趋势。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/articles/coinbase", className: styles.exchangeLink, children: "浏览Coinbase文章 →" })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeCard, style: {
            backgroundColor: "#f7f7f7"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.exchangeLogo, style: {
              backgroundColor: "#1f6feb"
            }, children: "All" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.exchangeInfo, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "所有文章" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "浏览所有交易所的文章，获取全面的加密货币市场资讯。" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: namedRoutes.articles(), className: styles.exchangeLink, children: "浏览所有文章 →" })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: styles.featuresSection, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { children: "我们的特色" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.featuresGrid, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.featureItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.featureIcon, children: "📊" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "实时聚合" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "自动获取最新发布的官方博客文章，确保信息时效性。" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.featureItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.featureIcon, children: "🔍" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "便捷浏览" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "清晰的分类和直观的界面，让您轻松找到所需信息。" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.featureItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.featureIcon, children: "📱" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "响应式设计" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "在任何设备上都能获得良好的阅读体验。" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.featureItem, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.featureIcon, children: "🌐" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { children: "中文支持" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "提供中文界面，降低语言障碍，方便中文用户使用。" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: styles.homeFooter, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "© 2025 加密货币资讯聚合平台 | 本站仅作为信息聚合，不构成投资建议" }) })
    ] })
  ] });
};
export {
  HomePage as default
};
