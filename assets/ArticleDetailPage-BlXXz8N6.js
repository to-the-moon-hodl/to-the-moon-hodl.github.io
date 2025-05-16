import { u as useParams, r as reactExports, j as jsxRuntimeExports, L as Link, n as namedRoutes } from "./index-DSG9X7hu.js";
import { M as Metadata } from "./Metadata-Dq_7ijNF.js";
const articleDetailContainer = "_articleDetailContainer_nug3v_2";
const articleDetail = "_articleDetail_nug3v_2";
const articleTitle = "_articleTitle_nug3v_23";
const articleMeta = "_articleMeta_nug3v_30";
const articleImage = "_articleImage_nug3v_38";
const articleContent = "_articleContent_nug3v_55";
const styles = {
  articleDetailContainer,
  articleDetail,
  articleTitle,
  articleMeta,
  articleImage,
  articleContent
};
const ArticleDetailPage = () => {
  const {
    url
  } = useParams();
  const decodedUrl = decodeURIComponent(url);
  const [article, setArticle] = reactExports.useState(null);
  const [source, setSource] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const fetchArticleDetail = async () => {
      try {
        let response = await fetch("/binance.json");
        if (!response.ok) {
          new Error("无法获取Binance文章数据");
        }
        let data = await response.json();
        let foundArticle = data.article_url_map[decodedUrl];
        if (foundArticle) {
          setArticle(foundArticle);
          setSource("binance");
          setLoading(false);
          return;
        }
        response = await fetch("/coinbase.json");
        if (!response.ok) {
          new Error("无法获取Coinbase文章数据");
        }
        data = await response.json();
        foundArticle = data.article_url_map[decodedUrl];
        if (foundArticle) {
          setArticle(foundArticle);
          setSource("coinbase");
          setLoading(false);
          return;
        }
        new Error("文章不存在");
      } catch (err) {
        setError(err instanceof Error ? err.message : "发生未知错误");
        setLoading(false);
      }
    };
    fetchArticleDetail().then((_) => {
    });
  }, [decodedUrl]);
  const getBackLinkRoute = () => {
    if (source === "binance") {
      return "/articles/binance";
    } else if (source === "coinbase") {
      return "/articles/coinbase";
    }
    return namedRoutes.articles();
  };
  const getSourceName = () => {
    if (source === "binance") {
      return "Binance";
    } else if (source === "coinbase") {
      return "Coinbase";
    }
    return "文章";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Metadata, { title: (article == null ? void 0 : article.title) || "文章详情", description: (article == null ? void 0 : article.title) || "文章详情页面" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articleDetailContainer, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "page-nav", style: {
        marginBottom: "20px"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: namedRoutes.home(), className: "nav-link", children: "返回首页" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: getBackLinkRoute(), className: "nav-link", style: {
          marginLeft: "10px"
        }, children: [
          "返回",
          getSourceName(),
          "文章列表"
        ] })
      ] }),
      loading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "loading", children: "正在加载文章..." }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "error", children: [
        "错误: ",
        error
      ] }),
      !loading && !error && article && /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: styles.articleDetail, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: styles.articleTitle, children: article.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: styles.articleMeta, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.articleAuthor, children: [
            "作者: ",
            article.author
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: styles.articleDate, children: [
            "发布日期:",
            " ",
            new Date(article.publishDate).toLocaleDateString("zh-CN")
          ] })
        ] }),
        source !== "binance" && article.image_url && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.articleImage, children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: article.image_url, alt: article.title }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: styles.articleContent, dangerouslySetInnerHTML: {
          __html: article.content
        } })
      ] })
    ] })
  ] });
};
export {
  ArticleDetailPage as default
};
