About
一个Vue+Flask前后端分离的社交博客
www.xx.com

关于：
本项目是基于狗书(Flask Web开发)项目不断扩展而成。
狗书项目采用的是服务端渲染模式，但现在已是前后端分离模式占主导，所以前端改用Vue，后端用Flask， 权限验证采用JWT
-补充狗书图片



功能：
    - 注册，登录，上传用户图像、兴趣封面
    - jwt权限验证
    - 修改密码/绑定邮箱支持邮箱验证码
    - 发布文章（支持带图片，富文本）
    - 评论，点赞文章
    - 回复，点赞评论
    - 用户间发送消息
    - 关注用户
    - @，评论，点赞，私信时websocket消息推送
    - 普通用户，内容管理员（可禁用评论），管理员（可禁用评论）
    - 评论敏感词过滤，图文请求限制次数
    - 七牛云图片存储

运行项目前的预备工作：安装了mysql,redis


启动：

前端：
克隆远程库： git clone xx
进入项目目录后，安装依赖: npm install 
运行服务器: npm run dev


后端：
1.创建虚拟环境
2.cd blog_backend
3.pip install -r ./requirements/dev.txt
4.执行flask shell，
5.进入到shell环境中后，执行 Role.insert_roles()；最后退出shell环境，执行exit()
6.python flasky.py（redis需要提前启动，否则会报错）


创建.env文件，或者从.env.example中复制，然后填写你的数据库凭证
如果要使用用户图像和文章图片功能，
修改前端项目.env文件中的变量VITE_QINIU_DOMAIN和VITE_QINIU_BUCKET为七牛云的测试域名和bucket（注册七牛云后每个月可免费使用10G空间）
修改后端项目.env文件中的变量QINIU_ACCESS_KEY和QINIU_SECRET_KEY为自己的身份凭证（七牛云个人中心中查看）

如果要用到邮件验证码功能：
修改后端项目.env文件中MAIL_USERNAME和MAIL_PASSWORD，该项目使用的是qq邮箱

技术栈：
前端： 
vue3
vue-router
pinia
axios
scss
socket-io
qiniu-js


后端：
Flask
Flask-JWT-Extended
Flask-SQLAlchemy
Flask-Limiter
flask-socketio
Celery

redis
mysql



支持docker部署：
1.修改后端项目中 deploy.sh文件
2.更改第一行： source /Users/v/Documents/proj/blog/blog_front/front.sh 为前端项目在本机的绝对位置
3.修改remote_cmd_backend命令中的环境变量值（参考前面写的修改.env环境变量）
4.修改ROMOTE_USER和ROMOTE_HOST为远程主机的用户名和远程主机名（本项目中这两个变量存放在系统环境变量中，所以代码中未显式定义）

4.cd blog_backend
5.执行 ./deploy.sh 或者 bash ./deploy.sh
6.可访问云服务器ip地址+端口 （本项目中访问的端口是1717，端口需要在云服务器上手动开放才能访问到）


Celery 参考介绍：
https://www.cnblogs.com/kangssssh/p/17201349.html

使用场景：

异步执行：解决耗时任务（本项目的用到的场景--发送邮件验证码）
延迟执行：解决延迟任务
定时执行：解决周期任务


前端部署：去掉了docker,直接将静态页面放在nginx上即可
成本： centos7上需要按转nginx
收益：去掉了dockerfile以及构建镜像步骤