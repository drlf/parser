处理下载的网页。

roadmap：
与handler结合，作为handler 的next串接到一起。可能分类下载和处理更合适？（中间数据不需要保留）
更换jsdom为cheerio,理由更快,校验更松.
对xsp的steps处理有困难,暂时没有解决截取的文本和元素混在一起的问题.

【确定】对不同来源的文件有不同的parser，各parser以url中host来组织，类似routers的方式。

数据来源：
文件【图片】
mongodb数据库
redis 适合作为交换数据用！！作为消息队列，分类crawler和parse。


