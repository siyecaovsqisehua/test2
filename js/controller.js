// 1.新建模块
var ShopModule = angular.module('ShopModule', ['ngRoute']);

// 2.配置路由
ShopModule.config(function($routeProvider) {
    $routeProvider
        .when('/index', {
            template: "<h3>这是首页</h3>"
        })
        .when('/shop', {
            templateUrl: 'template/shop.html',
            controller: "ShopController"
        })
        .when('/cart', {
            templateUrl: "template/cart.html",
            controller: "CartController"
        })
        .otherwise({
            redirectTo: '/index'
        })
})

ShopModule.controller('IndexController', function($scope, $http) {
    // 通过ajax请求data/shop.json的数据(模拟从后台服务器获取数据)
    $http.get('data/shop.json').then(function(msg) {
        // console.log(msg);
        $scope.shoplist = msg.data;
    })

    // 购物车数据默认为空
    $scope.cartlist = [];
})

ShopModule.controller('ShopController', function($scope) {
    // 根据id来获取shoplist的索引值
    function getShopIndex(id) {
        var index;
        angular.forEach($scope.shoplist, function(value, key) {
            if (value['id'] == id) {
                index = key;
            }
        })
        return index;
    }

    // 判断id是否存在于cartlist中
    function getCartIndex(id) {
        var index;
        // 判断id是否在cartlist中,也只能一个一个的问
        angular.forEach($scope.cartlist, function(value, key) {
            if (value['id'] == id) {
                console.log('存在');
                index = key;
            }
        })

        // 如果id存在,返回结果是cartlist中索引下标,如果不存在呢,返回的undefined
        return index;
    }

    // 点击添加到购物车
    $scope.addCart = function(id, ent) {

        // 需求:将数据从shoplist中添加到cartlist中,并且还需要添加一个num的数据
        // 添加num数据的同时,还需要注意,如果cartlist中存在该数据,让数量++,如果不存在该数据,则直接添加到cartlist中
        // $scope.shoplist[index]   // 用户点击的商品
        // 根据id来获取shoplist的索引
        // console.log($scope.shoplist[getShopIndex(id)]);
        // 判断该商品是否存在于cartlist中
        var cIndex = getCartIndex(id);
        var sIndex = getShopIndex(id);

        if (cIndex == undefined) {
            // 不存在(第一次添加该商品)
            var obj = $scope.shoplist[sIndex];
            // 第一次商品被添加到cartlist中,数量默认为1
            obj['num'] = 1;
            $scope.cartlist.push(obj);
        } else {
            // 存在,让存在的数据的num+1(第n次添加该商品)
            $scope.cartlist[cIndex]['num']++;
        }

        // ===============================================
        var flyObj = $('<img src="' + $scope.shoplist[sIndex]['pic'] + '" width="50">');
        flyObj.fly({
                // 相对于当前窗口的坐标点
                start: {
                    left: ent.clientX, //开始位置（必填）新创建的div元素会被设置成position: fixed
                    top: ent.clientY, //开始位置（必填）
                },
                end: {
                    left: 100, //结束位置（必填）
                    top: 50, //结束位置（必填）
                    // width: 100, //结束时高度
                    // height: 100, //结束时高度
                },
                // autoPlay: false, //是否直接运动,默认true
                speed: 1.1, //越大越快，默认1.2
                vertex_Rtop: 20, //运动轨迹最高点top值，默认20
                onEnd: function() {
                        console.log('商品添加成功');
                        flyObj.remove();
                    } //结束回调
            })
            // ===============================================

    }
})

ShopModule.controller('CartController', function($scope) {
    // 减
    $scope.jian = function(index) {
        if ($scope.cartlist[index].num > 0) {
            $scope.cartlist[index].num--;
        }
    }

    // 加
    $scope.jia = function(index) {
        $scope.cartlist[index].num++;
    }

    // 删除
    $scope.del = function(index) {
        // 从数组中删除一个值
        $scope.cartlist.splice(index, 1);
    }

    // 监测cartlist的变化,发生变化，重新计算总价格和总数量
    $scope.$watch('cartlist', function() {
        // 定义对象，默认总价格和总数量为0
        $scope.total = {
            price: 0,
            num: 0
        }

        // 全部选中，isBool为真 否则为假
        $scope.isBool = true; // 默认全选
        angular.forEach($scope.cartlist, function(value, key) {
            if (value['isCheck']) {
                // 总价格
                $scope.total.price += value.price * value.num;

                // 总数量
                $scope.total.num += value.num;
            } else {
                // 不选中，不计算价格和数量
                $scope.isBool = false;
            }
        })

        // 深度监听
    }, true)

    $scope.check = function() {
        angular.forEach($scope.cartlist, function(value, key) {
            value['isCheck'] = $scope.checkAll;
        })
    }
})
