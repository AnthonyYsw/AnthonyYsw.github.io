# 个人网站维护指南

这是一个使用 Jekyll、Liquid 和 Sass 的静态网站。页面内容用 Markdown 编写，导航和画廊使用 YAML 配置；无需 Node.js 或前端框架。

## 本地预览与构建

当前锁定的依赖在 Ruby 3.2.3、Bundler 2.4.19 下验证通过。Gemfile 保持现有的 Jekyll 3.10 / Sass converter 1.5 版本范围，具体依赖版本由 `Gemfile.lock` 锁定。

```sh
bundle install
bundle exec jekyll serve
```

打开 <http://localhost:4000>。修改内容、模板和样式后会自动重新构建；修改 `_config.yml` 后需要重启预览服务。

发布前检查：

```sh
bundle exec jekyll build
git diff --check
```

生成文件位于 `_site/`，不要直接编辑或提交它们。提交 `Gemfile.lock`，仅在明确需要升级依赖时更新它。

## 常见修改入口

| 要修改的内容 | 文件 |
| --- | --- |
| 站点名称、页眉名称、版权年份、日期格式 | `_config.yml` |
| 导航名称、顺序和链接 | `_data/navigation.yml` |
| 首页、个人介绍、联系方式 | `index.md`、`about.md`、`contact.md` |
| CV 下载地址 | `about.md` 中的下载链接 |
| 文章正文与标题 | `_posts/` |
| 画廊照片、顺序、拍摄参数 | `_data/galleries/` |
| 页面骨架 | `_layouts/default.html` |
| 文章标题与日期 | `_layouts/post.html` |
| 页头资源、导航、页脚、弹层 | `_includes/head.html`、`header.html`、`footer.html`、`lightbox.html` |

导航中的站内路径会通过 `relative_url` 自动处理 `_config.yml` 的 `baseurl`。图片仍使用原来的 OSS 地址。

## 添加普通文章

在 `_posts/` 新建 `YYYY-MM-DD-name.md`：

```markdown
---
layout: post
title: "文章标题"
date: 2026-10-13 12:00:00 +0100
---

在这里写 Markdown 正文。
```

`date` 需包含正确的时区。现有文章的文件名和日期参与生成链接，修改它们可能改变文章地址。

## 添加画廊

1. 在 `_data/galleries/` 新建清单，例如 `my-trip.yml`。
2. 在文章头部添加 `gallery: my-trip`。
3. 在正文需要的位置插入 `{% include gallery.html id=page.gallery %}`。

图片清单示例：

```yaml
base_url: "https://your-bucket.example.com/my-trip/"
thumbnail_query: "?x-oss-process=image/resize,p_60/quality,q_85"
defaults:
  aperture: "f/2"
  focal: "40mm"
photos:
  - file: "DSC_0001.JPG"
    alt: "河边的树"
    shutter: "1/4000"
  - file: "DSC_0002.JPG"
    alt: "傍晚的街道"
    aperture: "f/8"
    shutter: "1/500"
    thumbnail_query: ""
```

`base_url` 以 `/` 结尾；`file` 区分大小写。清单顺序就是展示顺序。缩略图和原图共用文件路径，无需重复填写完整 URL。

`defaults` 可省略，用于同一画廊共有的拍摄参数；每张照片可以单独覆盖。`alt` 默认为 `Photo`。未填写的拍摄参数不显示，显式填写 `N/A` 则按原样展示。

`thumbnail_query` 是图片服务的处理参数，可在画廊或单张照片上设置。单张照片省略时继承画廊设置，设为 `""` 时直接使用原图。现有荷花画廊中保留了这一例外，避免改变原来的图片效果。

完整的画廊文章：

```liquid
---
layout: post
title: "旅行照片"
date: 2026-10-13 12:00:00 +0100
gallery: my-trip
---

这里也可以先写一段介绍。

{% include gallery.html id=page.gallery %}
```

普通文章中仍可沿用单张图片组件，自定义缩略图与原图地址：

```liquid
{% include photo.html
  small_src="https://example.com/photo-small.jpg"
  large_src="https://example.com/photo.jpg"
  alt="照片说明"
  aperture="f/8"
  shutter="1/500"
  focal="50mm"
%}
```

## 样式与交互的职责

`assets/css/main.scss` 只负责按顺序引入样式：

| 文件 | 职责 |
| --- | --- |
| `_sass/_tokens.scss` | 字体、内容宽度、留白和主题颜色 |
| `_sass/_base.scss` | 文档基础样式、内容容器 |
| `_sass/_layout.scss` | 顶部导航、页脚与布局 |
| `_sass/_components.scss` | 文章列表、代码块、下载按钮 |
| `_sass/_gallery.scss` | 相框、缩略图与参数悬停效果 |
| `_sass/_lightbox.scss` | 大图弹层与动画 |

保持 CSS 选择器及引入顺序稳定，避免无意改变层叠关系。修改视觉参数优先从 `_tokens.scss` 开始。

`assets/js/script.js` 只做两件事：根据照片的 `data-*` 属性显示拍摄参数，以及控制大图弹层。点击事件使用委托，所有缩略图共用一个处理函数；点击关闭符号或弹层背景关闭，点击大图保持打开。旧的 `photo.html` 接口保持兼容。

修改后，预览首页、文章列表、个人介绍、联系方式、404 页面和画廊；检查桌面与窄屏布局、导航悬停、照片参数以及大图打开／关闭。重构时可将前后版本构建到不同目录，对比生成的页面和样式。
