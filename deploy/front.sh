#!/bin/bash

function front_to_remote(){
    base_path="/Users/v/Documents/proj/blog/blog_front"
    # macOS：uname 输出为 Darwin
    if [[ "$(uname)" == "Darwin" ]]; then
        base_path="/e/project/vue-proj/responsive_new"
    fi
    # 对项目打包
    cd $base_path
    npm run build --mode=production

    # 本地打包目录
    LOCAL_BUILD_DIR="dist"
    # 服务器目录
    SERVER_DIR="/usr/local/nginx/html"

    # 压缩本地dist目录
    echo "压缩本地dist目录..."
    tar -czf dist.tar.gz -C $LOCAL_BUILD_DIR .

    ssh $ROMOTE_USER@$ROMOTE_HOST "echo '删除远程目录旧文件...'; rm -rf $SERVER_DIR/*;"

    echo '传输文件开始...';
    scp dist.tar.gz $ROMOTE_USER@$ROMOTE_HOST:$SERVER_DIR
    if [[ $? -eq 0 ]];then
        echo "传输成功 $LOCAL_FILE"
    else
        echo "传输失败"
    fi

    ssh $ROMOTE_USER@$ROMOTE_HOST "cd $SERVER_DIR; echo '解压压缩文件'; tar -xzf dist.tar.gz -C . --no-xattrs;echo '删除远程压缩包'; rm dist.tar.gz; echo '重启Nginx...'; nginx -s reload"

    # 删除本地压缩包
    echo "删除本地压缩包..."
    rm -f dist.tar.gz   
    echo "前端部署完成！"
}