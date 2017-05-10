/*
****************基础配置****************
{
    mode: 模块化类型(AMD,CDM, CommandJs)
    baseUrl: 基础路径
    path: 配置别名或者路径
}
*/
fis.hook('module', {
  mode: 'commonJs',
  baseUrl: "./modules/",
  paths: {    
    api: "common/api/",
    web: "common/web/",
    utils: "common/utils/",
    widgets: "widgets/",
    zepto: "/libs/zepto",
    vue: "/libs/vue"        
  }
});

fis.hook('relative'); 

/*设置模块目录, 打包时自动包裹define*/
fis.match('/modules/**.js', {
  isMod: true
});

fis.match('/modules/common/base/*.js', {
  isMod: false
});

fis.match('/modules/common/base.js', {
  isMod: false
});

/*设置发布时不产出的文件*/
fis.match('**.{tmpl,txt,md,json,db}', {
  release: false
});

/*内嵌资源不产出*/
fis.match('/views/pages/includes', {
  release: false
});

/*设置打包时自动处理模块化依赖关系*/
fis.match('::package', {
    // npm install [-g] fis3-postpackager-loader
    // 分析 __RESOURCE_MAP__ 结构，来解决资源加载问题
    postpackager: fis.plugin('loader', {
        resourceType: 'commonJs',
        useInlineMap: true // 资源映射表内嵌
    }),

    /*设置零散资源自动打包*/
    postpackager: fis.plugin('loader', {
      allInOne: {
        js: function (file) {
          return "/static/js/pages/" + file.filename + ".js";
        },
        css: function (file) {
          return "/static/css/" + file.filename + ".css";
        }
      }      
    })
});

/****************打包设置***************/



/*指定文件添加md5戳*/
fis.match('**.{js,vue,css,png,jpg,gif}', {
  useHash: true
});

/*设置png图片压缩插件*/
fis.match('*.png', {
  // fis-optimizer-png-compressor 插件进行压缩，已内置
  optimizer: fis.plugin('png-compressor')
});

/*第三方组件合并处理*/
fis.match('libs/**.js', {
  packTo: 'static/js/libs.pack.js',
  release: 'static/js/libs.pack.js',
  url : '/BUGClose/static/js/libs.pack.js'  
});

// /*公共组件合并处理*/
fis.match('modules/common/base/**.js', {
  packTo: 'static/js/base.pack.js'
});

fis.match('modules/common/utils/**.js', {
  packTo: 'static/js/utils.pack.js'
});

fis.match('modules/common/api/**.js', {
  packTo: 'static/js/api.pack.js'
});

fis.match('modules/common/web/**.js', {
  packTo: 'static/js/web.pack.js'
});

fis.match('modules/widgets/**.{js,vue}', {
  packTo: 'static/js/widgets.pack.js'
});

fis.match('modules/pages/includes/**.{js,vue}', {
  packTo: 'static/js/includes.pack.js'
});

fis.match('modules/pages/**/(*.{js,vue})', {
  release: 'static/js/pages/$1'
});

/*样式合并处理*/
fis.match('views/css/**.css', {
  packTo: 'static/css/common.pack.css'
});

fis.match('modules/pages/(*/*)/**.css', {
  packTo: 'static/css/$1.css'
});

fis.match('modules/widgets/(**.css)', {
  packTo: 'static/css/widgets.pack.css'
});


/*图片输出处理*/
fis.match('views/**/(*.{png,jpg,gif})', {
  release: 'static/img/$1'
});

fis.match('modules/**/(*.{png,jpg,gif})', {
  release: 'static/img/$1'
});

/*html输出到根目录下*/
fis.match('views/pages/(**.html)', {
  release: '/pages/$1'
});

/*html输出到根目录下*/
fis.match('views/pages/(index.html)', {
  release: '/$1'
});


// fis.match('*.js', {
//   optimizer: fis.plugin('uglify-js')
// })
// .match("*.css", {
//   optimizer: fis.plugin('clean-css')    
// });

fis.match('**', { relative: true })

/*
  多状态处理  
  使用场景: 假设我们有如下需求，当在开发阶段资源都不压缩，但是在上线时做压缩，那么就可以使用这个配置了
  如何使用: fis3 release <media>  

  开发环境: fis3 release -wL
  测试环境: fis3 release test (不用带多余参数, 会自动输出压缩包)
  线上环境: fis3 release prod (不用带多余参数, 会自动输出压缩包)
*/
fis.media('prod')
    
    // .match('*.js', {
    //   optimizer: fis.plugin('uglify-js')
    // })
    .match("*.css", {
      optimizer: fis.plugin('clean-css')    
    })
    .match('**', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
        }),

        // fis.plugin('zip', {
        //   filename: "bugclose.zip"
        // }),
        fis.plugin('local-deliver', {
          to: '../pcWeb'
        }) //must add a deliver, such as http-push, local-deliver
    ]
});

fis.media('test')
    // .match('*', {
    //     domain: '/3ad076'
    // })
    .match('**', {
      deploy: [
        fis.plugin('skip-packed', {
          // 配置项
        }),

        // fis.plugin('zip', {
        //   filename: "wap_user.zip"
        // }),
        fis.plugin('local-deliver', {
          to: '../pcWeb'
        }) //must add a deliver, such as http-push, local-deliver
    ]
});
    

/*排除一些文件*/
fis.set('project.ignore', [
    "fis-conf.js",
    //"/views/pages/test/**",
    "node_modules/**",
    "/views/pages/includes/**"
]);


/*vue单文件组件配置*/
fis.match('**.vue', {
  isMod: true,
  rExt: 'js',
  useSameNameRequire: true,
  parser: fis.plugin('vue-component', {
    cssScopeFlag: 'vuec'
  })
});