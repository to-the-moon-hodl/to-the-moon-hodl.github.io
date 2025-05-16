import { R as React, h as helmetPkg } from "./index-DSG9X7hu.js";
const { Helmet: HelmetHead } = helmetPkg;
const EXCLUDE_PROPS = ["charSet"];
const propToMetaTag = (parentKey, parentValue, options) => {
  if (Array.isArray(parentValue)) {
    return parentValue.flatMap((value) => {
      return propToMetaTag(parentKey, value, options);
    });
  } else if (typeof parentValue === "object") {
    return Object.entries(parentValue).filter(([_, v]) => v !== null).flatMap(([key, value]) => {
      return propToMetaTag(`${parentKey}:${key}`, value, { attr: "property" });
    });
  } else {
    const attributes = {
      [options["attr"]]: parentKey,
      content: parentValue
    };
    return /* @__PURE__ */ React.createElement("meta", { ...attributes });
  }
};
const Metadata = (props) => {
  const { children, ...metaProps } = props;
  let Head = HelmetHead;
  const tags = Object.entries(metaProps).filter(
    ([key, value]) => !EXCLUDE_PROPS.includes(key) && value !== null && (key !== "og" || value !== true)
  ).flatMap(([key, value]) => {
    return propToMetaTag(key, value, { attr: "name" });
  }).filter((tag) => !!tag);
  if (metaProps.title) {
    [metaProps.title].flat().reverse().map((title) => {
      tags.unshift(/* @__PURE__ */ React.createElement("title", null, title));
    });
  }
  if (metaProps.charSet) {
    tags.push(/* @__PURE__ */ React.createElement("meta", { charSet: metaProps.charSet }));
  }
  if (metaProps.og) {
    if (metaProps.title && !metaProps.og.title && metaProps.og.title !== null) {
      tags.push(/* @__PURE__ */ React.createElement("meta", { property: "og:title", content: metaProps.title }));
    }
    if (metaProps.description && !metaProps.og.description && metaProps.og.description !== null) {
      tags.push(
        /* @__PURE__ */ React.createElement("meta", { property: "og:description", content: metaProps.description })
      );
    }
    if (!metaProps.og.type && metaProps.og.type !== null) {
      tags.push(/* @__PURE__ */ React.createElement("meta", { property: "og:type", content: "website" }));
    }
  }
  return /* @__PURE__ */ React.createElement(Head, null, tags.map((tag, i) => React.cloneElement(tag, { key: i })), children);
};
export {
  Metadata as M
};
