import { u as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, n as namedRoutes, a as navigate } from "./index-DSG9X7hu.js";
import { M as Metadata } from "./Metadata-Dq_7ijNF.js";
const articlesContainer = "_articlesContainer_3euqk_2";
const articleCard = "_articleCard_3euqk_8";
const articleImage = "_articleImage_3euqk_20";
const articleContent = "_articleContent_3euqk_26";
const articleTitle = "_articleTitle_3euqk_30";
const articleAuthor = "_articleAuthor_3euqk_37";
const articleDate = "_articleDate_3euqk_38";
const articleExcerpt = "_articleExcerpt_3euqk_44";
const articleLink = "_articleLink_3euqk_53";
const articleSource = "_articleSource_3euqk_68";
const paginationContainer = "_paginationContainer_3euqk_79";
const pagination = "_pagination_3euqk_79";
const pageButton = "_pageButton_3euqk_96";
const pageNumber = "_pageNumber_3euqk_96";
const active = "_active_3euqk_118";
const pageDots = "_pageDots_3euqk_124";
const pageInfo = "_pageInfo_3euqk_129";
const pageSettings = "_pageSettings_3euqk_136";
const settingsGroup = "_settingsGroup_3euqk_146";
const articlesPerPageSelect = "_articlesPerPageSelect_3euqk_157";
const sourceSelect = "_sourceSelect_3euqk_158";
const styles = {
  articlesContainer,
  articleCard,
  articleImage,
  articleContent,
  articleTitle,
  articleAuthor,
  articleDate,
  articleExcerpt,
  articleLink,
  articleSource,
  paginationContainer,
  pagination,
  pageButton,
  pageNumber,
  active,
  pageDots,
  pageInfo,
  pageSettings,
  settingsGroup,
  articlesPerPageSelect,
  sourceSelect
};
const ArticlesPage = () => {
  const {
    source
  } = useParams();
  const [articles, setArticles] = reactExports.useState([]);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  const [currentPage, setCurrentPage] = reactExports.useState(1);
  const [articlesPerPage, setArticlesPerPage] = reactExports.useState(6);
  const getSourceInfo = () => {
    const validSources = ["binance", "coinbase"];
    const normalizedSource = (source == null ? void 0 : source.toLowerCase()) || "all";
    if (!source || !validSources.includes(normalizedSource)) {
      return {
        title: "全部文章列表",
        description: "Binance和Coinbase的文章列表",
        dataSource: "all"
      };
    }
    return {
      title: `${normalizedSource === "binance" ? "Binance" : "Coinbase"}文章列表`,
      description: `${normalizedSource === "binance" ? "Binance" : "Coinbase"}的文章列表`,
      dataSource: normalizedSource
    };
  };
  const sourceInfo = getSourceInfo();
  reactExports.useEffect(() => {
    const fetchArticles = async () => {
      try {
        const dataSource = sourceInfo.dataSource;
        let allArticles = [];
        if (dataSource === "all" || dataSource === "binance") {
          const binanceResponse = await fetch("/binance.json");
          if (binanceResponse.ok) {
            const binanceData = await binanceResponse.json();
            const binanceArticles = Object.values(binanceData.article_url_map).map((article) => ({
              ...article,
              source: "binance"
            }));
            allArticles = [...allArticles, ...binanceArticles];
          }
        }
        if (dataSource === "all" || dataSource === "coinbase") {
          const coinbaseResponse = await fetch("/coinbase.json");
          if (coinbaseResponse.ok) {
            const coinbaseData = await coinbaseResponse.json();
            const coinbaseArticles = Object.values(coinbaseData.article_url_map).map((article) => ({
              ...article,
              source: "coinbase"
            }));
            allArticles = [...allArticles, ...coinbaseArticles];
          }
        }
        allArticles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());
        setArticles(allArticles);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "发生未知错误");
        setLoading(false);
      }
    };
    fetchArticles().then((_) => {
    });
  }, [sourceInfo.dataSource]);
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(articles.length / articlesPerPage);
  const handlePageChange = (pageNumber2) => {
    setCurrentPage(pageNumber2);
  };
  const handleArticlesPerPageChange = (e) => {
    setArticlesPerPage(Number(e.target.value));
    setCurrentPage(1);
  };
  const handleSourceChange = (e) => {
    const newSource = e.target.value;
    if (newSource === "all") {
      navigate(namedRoutes.articles());
    } else {
      navigate(`/articles/${newSource}`);
    }
  };
  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);
    if (endPage - startPage < 4 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }
    if (startPage > 1) {
      pageNumbers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(1), className: styles.pageNumber, children: "1" }, "first"));
      if (startPage > 2) {
        pageNumbers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.pageDots, children: "..." }, "dots1"));
      }
    }
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(i), className: `${styles.pageNumber} ${currentPage === i ? styles.active : ""}`, children: i }, i));
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: styles.pageDots, children: "..." }, "dots2"));
      }
      pageNumbers.push(/* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(totalPages), className: styles.pageNumber, children: totalPages }, "last"));
    }
    return pageNumbers;
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Metadata, { title: sourceInfo.title, description: sourceInfo.description }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { children: sourceInfo.title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "page-nav", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: namedRoutes.home(), className: "nav-link", children: "返回首页" }) }),
    loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "loading", children: "正在加载文章..." }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "error", children: [
      "错误: ",
      error
    ] }),
    !loading && !error && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.pageSettings, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "sourceSelect", children: "数据源: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "sourceSelect", value: sourceInfo.dataSource, onChange: handleSourceChange, className: styles.sourceSelect, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "all", children: "全部" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "binance", children: "Binance" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "coinbase", children: "Coinbase" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.settingsGroup, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { htmlFor: "articlesPerPage", children: "每页显示文章数: " }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { id: "articlesPerPage", value: articlesPerPage, onChange: handleArticlesPerPageChange, className: styles.articlesPerPageSelect, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "6", children: "6" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "12", children: "12" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "15", children: "15" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "24", children: "24" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articlesContainer, children: [
        currentArticles.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "没有找到文章" }) : currentArticles.map((article, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articleCard, children: [
          article.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.image_url, alt: article.title, className: styles.articleImage }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articleContent, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articleSource, children: [
              "来源: ",
              article.source === "binance" ? "Binance" : "Coinbase"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: styles.articleTitle, children: article.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.articleAuthor, children: [
              "作者: ",
              article.author
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.articleDate, children: [
              "发布日期:",
              " ",
              new Date(article.publishDate).toLocaleDateString("zh-CN")
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: styles.articleExcerpt, children: article.excerpt }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: namedRoutes.articleDetail({
              url: encodeURIComponent(article.url)
            }), className: styles.articleLink, children: "阅读更多" })
          ] })
        ] }, index)),
        articles.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.paginationContainer, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.pagination, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(currentPage - 1), disabled: currentPage === 1, className: styles.pageButton, children: "上一页" }),
            renderPageNumbers(),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => handlePageChange(currentPage + 1), disabled: currentPage === totalPages, className: styles.pageButton, children: "下一页" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.pageInfo, children: [
            "第 ",
            currentPage,
            " 页 / 共 ",
            totalPages,
            " 页"
          ] })
        ] })
      ] })
    ] })
  ] });
};
export {
  ArticlesPage as default
};
