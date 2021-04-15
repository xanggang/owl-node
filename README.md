## owl-node 前端日志收集平台
项目基于egg+mysql。 

## 基本功能
前端错误收集、map文件解析（需要传到七牛云对应的空间）、PV/UV统计、浏览器访问分析、性能分析、接口错误日志

## 项目启动
项目启动需要安装以下依赖
1，node 6.0以上版本
2，mysql 5.7版本
sql文件在根目录
```
  mysql: {
    address: '100.100.1.100',
    password: 'password',
  }
```
3，七牛云相关
```
{
    "accessKey": "2alru5_IaH7milnTTB2f2Y-fhKMRWf1S9CYFLaMm",
    "secretKey": "yN8Nf2JD1L6O2gN9EqBJ03Gz6SsLiCHRlG_amyza",
    "bucket": "owl-node"
}
```

## 前台展示地址
`http://owl-web.lynn.cool/`

## tips
项目正处于并将长期处于demo阶段， 有机会的话在整理代码格式和测试用例之类的。
