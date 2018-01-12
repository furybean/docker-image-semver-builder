# Docker Image Semver Builder

这是一个使用配置文件来维护 Docker Image 语义化版本的工具，可以通过简单的命令对 Docker Image 进行更新版本、编译镜像、推送镜像。

## 配置文件

配置文件使用 yaml 格式，文件名为 dis-config.yml，需要放在项目的根路径下。

一个简单的配置文件的格式如下：

```yml
default:
  description: A default docker image
  imageName: dockerhub.com/fe/test-image # Docker Image tag 的前缀
  version: 0.0.3 # Docker Image tag 的后缀，后缀和前缀之间使用 : 分割
  file: Dockerfile # Dockerfile 的路径
  workDir: ./ # 编译 Docker 镜像使用的 workDir，如果不指定，使用 Dockerfile 所在文件夹
another:
  description: Another docker image
  imageName: dockerhub.com/fe/another-image
  version: 0.1.0
  file: another/Dockerfile
```

其中 `default` 和 `another` 是 Docker Image 的名字，在使用本工具的时候需要用到。

## 全局使用

你可以把本工具使用安装在全局，这样就可以对多个项目使用。

安装命令如下：
```Bash
npm i -g docker-image-semver-builder
```

目前只包含三个命令：更新版本、编译镜像、推送镜像，使用说明见下方示例。

更新 `another` 在配置文件中的版本(也可以手动更新)：
```Bash
di-semver-builder version patch another
```

编译 `another` 配置文件中版本的镜像：
```Bash
di-semver-builder build another
```

推送 `another` 配置文件中版本的镜像：
```Bash
di-semver-builder push another
```

## 单项目使用

单项目使用需要把本工具安装到你的项目中：
```Bash
npm i docker-image-semver-builder
```

然后在你项目的 package.json 中增加如下配置：

```JSON
"scripts": {
  "update-image-version": "di-semver-builder version",
  "build-image": "di-semver-builder build",
  "push-image": "di-semver-builder push"
},
```

更新 `another` 在配置文件中的版本(也可以手动更新)：
```Bash
npm run update-image-version patch another
```

编译 `another` 配置文件中版本的镜像：
```Bash
npm run build-image another
```

推送 `another` 配置文件中版本的镜像：
```Bash
npm run build-image another
```

## License
MIT