# 说明文档

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve or npm start
```

### Compiles and minifies for production
```
yarn run build or npm run build
```

### Lints and fixes files
```
yarn run lint or run lint
```

### Run your unit tests
```
yarn run test:unit or run test:unit
```

## 超级警告
```
编辑器里面禁用tab，全部使用空格，默认2个空格，一定要把Tab转换成空格，否则代码编译不通过
```

 ### 目录结构说明
-------------------
  + 1.config：nginx配置文件
  + 2.dist：build生成文件目录
  + 3.generator：生产nginx脚手架
  + 4.logs：日志目录
  + 5.public：vue的默认文件
  + 6.src：项目开发目录

### 开发-合并-发布
- 1、每次开发新功能，先切换到develop分支，拉取最新代码
- 2、切换回自己的分支（feature/xxx），合并develop代码到当前分支 -> 推送
     + 注：代码冲突，自行解决冲突，解决方式不可以直接删掉别人的冲突代码

- 3、功能开发完成，提交并推送代码到当前分支（feature/xxx）
- 4、使用自己账户登录Gitlab，进入当前项目（Project），点击 Merge Requests -> New merge request，左边选择自己的开发分支（feature/xxx），右边选择develop
- 5、然后点击 Compare branches and continue -> Assignee（负责人），可以在Description里面写一些描述，最后通知负责人进行代码合并操作。
- 6、负责人登录Gitlab进去该项目，会在 Merge Requests 菜单中看到合并请求通知，进入后点击Accept merge request进行代码合并。
     + 注：该步骤是发起在线代码合并请求。如遇代码和develop有冲突，先切换到develop分支，拉取最新代码，然后从第2步开始进行操作
- 7、代码发布：负责人登录walle系统，选择 我的上线单 -> 创建上线单，选择需要发布的环境（测试环境、线上环境），输入上线单标题、选择分支、选择版本 -> 确认 -> 上线

### 开发说明
-------------------
- 代码风格统一使用2个空格，不能使用tab键
  + 新建 feature/xxx_xxx

- js要求使用es6语法
  + js 里面不能出现var全局定义，字符串使用单引号

- css 要求使用scss，请一定按照下面的书写方式进行编写
  + 1.位置属性(position, top, right, z-index, display, float等)
  + 2.大小(padding, margin, width, height)
  + 3.文字系列(font, line-height, letter-spacing, color- text-align等)
  + 4.背景(background, border等)
  + 5.其他CSS3特性(animation, transition等)

- 静态资源，一定要放在静态目录下面进行引用
- 每一操作步骤，请观察终端控制台的打印输出信息，如有报错提示，一定要修改

