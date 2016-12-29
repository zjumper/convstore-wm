'use strict';

var wmApp = angular.module('wmApp', ['ui.router', 'ui.layout', 'ui.bootstrap', 'angoose.client']);
/**
 * UI-Router configuration
 **/
wmApp.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/home');

    $stateProvider

        // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            views: {
              '': { templateUrl: 'views/main.html' },
              'nav@home': {
                templateUrl: 'views/nav.html',
                controller: 'navCtl'
              },
              'center@home': {
                templateUrl: 'views/center.html',
                controller: 'centerCtl'
              },
              'footer@home': {
                templateUrl: 'views/footer.html',
                controller: 'footerCtl'
              },
            }
        })
        .state('orders', {
            url: '/orders',
            views: {
              '': {
                templateUrl: 'views/orders.html',
                controller: 'ordersCtl'
              }
            }

        })
        .state('about', {
            url: '/about',
            views: {
              '': { templateUrl: 'views/about.html' },
              'nav@about': {
                templateUrl: 'views/nav.html',
                controller: 'navCtl'
              }
            }

        });

});

/**
 * Nav pane controller
 */
wmApp.controller('navCtl', ['$rootScope', '$scope', 'productService', function($rootScope, $scope, productService) {
  $scope.filter = '';
  $scope.categories = [{id:0, label:'热餐', link:'#home'},
    {id:1, label:'餐饮', link:'#about'},
    {id:2, label:'食品', link:'#daily'},
    {id:3, label:'百货', link:'#daily'},
    {id:4, label:'其他', link:'#other'}];
  $scope.category = $scope.categories[0].label;

  $scope.changeCategory = function(cate) {
    productService.loadProduct(cate);
    $scope.category = $scope.categories[cate].label;
  };
  $scope.filterProducts = function() {
    $rootScope.$broadcast('filter.products', $scope.filter);
  };
  $scope.clearFilter = function() {
    $scope.filter = '';
    $rootScope.$broadcast('filter.products', $scope.filter);
  }
}]);

/**
 * Main pane controller
 */
wmApp.controller('centerCtl', ['$scope', '$http', 'cartService', 'productService', function($scope, $http, cartService, productService) {
  // $scope.products = [{id:0, label:'热餐', pic:'box.png', price:1.00, link:'#home'},
  //   {id:1, label:'煮雨颜文字君玛格丽特手印饼（蛋黄&抹', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:1, label:'零食', pic:'box.png', price:1.00, unit:'个', link:'#about'},
  //   {id:2, label:'日用', pic:'box.png', price:1.00, unit:'个', link:'#daily'},
  //   {id:3, label:'其他', pic:'box.png', price:1.00, unit:'个', link:'#other'}];

  // $scope.products = Product.$query({});
  $scope.products = productService.loadProduct(0);

    // $scope.$broadcast('dataloaded');
    // productService.initData();

    $scope.addToCart = function(id, name, price) {
      // console.log(event);
      var fly = $('.fly');
      fly.css({display:'block',
               left: event.pageX,
               top: event.pageY});
      var top = $('#footer').offset().top + 10;
      var left = $(window).width() - 120;
      fly.animate({
        top: top + 'px', // bottom-right
        left: left + 'px'
      }, 700, 'easeInOutExpo',
      ()=>{fly.css({display:'none'});});

      cartService.add(id, name, price);
    };

    $scope.$on('category.change', function(event) {
      $scope.products = productService.currentProducts;
    });

    $scope.$on('filter.products', function(event, filter) {
      if(filter && filter != '') {
        $scope.products = _.filter(productService.currentProducts, function(p) {
          return p.name.indexOf(filter) > -1;
        });
      } else {
        $scope.products = productService.currentProducts;
      }
    });
}]);

/**
 * Nav pane controller
 */
wmApp.controller('footerCtl', ['$scope', '$http', 'cartService', function($scope, $http, cartService) {

  $scope.mobile = '';
  $scope.address = '';
  // get user info from server
  $http.get('/api/getUserInfo').success(function(data) {
    // console.log(data);
    // var user = JSON.parse(data);
    var user = data;
    console.log(user);
    var img = user.headimgurl;
    if(img && img != '/img/user-icon.png') {
      img = img.substring(0, img.length - 1) + '46';
      $scope.headimgurl = img;
    } else $scope.headimgurl = "/img/user-icon.png";
    $scope.openid = user.openid;
    if(user.nickname)
      $scope.nickname = user.nickname;
    else $scope.nickname = "匿名";

    var n = user.contact.length;
    if(n > 0) {
      $scope.mobile = user.contact[n - 1].mobile;
      $scope.address = user.contact[n - 1].address;
    }
  });

  //
  $scope.cart = cartService.cart;
  $scope.$on('cart.change', function(event){
    $scope.cart = cartService.cart;
    // console.log($scope.cart);
  });
  $scope.$on('cart.submit', function(event, data) {
    if(data === 'success') {
      $scope.tips('success', '您的订单已经确认，我们将尽快为您派送！');
    } else {
      $scope.tips('fail', '抱歉，您的订单提交发生错误，请稍后再试或电话与我们联系，85856735。');
    }
  });

  $scope.clearMobile = function() {
    console.log('clear mobile');
    $scope.mobile = '';
  };

  $scope.clearAddress = function() {
    console.log('clear address');
    $scope.address = '';
  };
  $scope.tips = function(status, msg) {
    if(status === 'success') {
      $('#tips').text(msg).css({
        'display': 'block',
        'text-align': 'center'
      }).addClass('alert alert-success');
    } else if(status === 'fail') {
      $('#tips').text(msg).css({
        'display': 'block',
        'text-align': 'center'
      }).addClass('alert alert-danger');
    }
  };
  $scope.hideTips = function() {
    $('#tips').text('').removeClass().hide();
  }

  $scope.toggleCart = function() {
    //var modal = $('#cart-modal').toggle();
    $scope.hideTips();
  };

  $scope.emptyCart = function() {
    // console.log('cart empty');
    cartService.empty();
  };

  $scope.submitCart = function() {
    console.log('cart submit');
    $scope.hideTips();
    if($scope.cart.total.amount < 58) {
      $scope.tips('fail', '全时外送58元起送。');
    } else {
      var contact = {};
      // contact.mobile = $('#mobile').val();
      // contact.address = $('#address').val();
      contact.mobile = $scope.mobile;
      contact.address = $scope.address;
      if(contact.mobile == undefined || contact.mobile == ''
        || contact.address == undefined || contact.address == '') {
        $scope.tips('fail', '请填写正确的移动联系电话和外送地址信息！');
        return;
      }
      cartService.submit(contact);
    }
  };
}]);

/**
 * Product service
 */
wmApp.service('productService', ['$rootScope', 'Product', function($rootScope, Product) {
  var svc = {
    currentProducts: [],
    loadProduct: function(cat) {
      var ret = {};
      if(cat) {
        ret = Product.$query({'category': cat});
      } else {
        ret = Product.$query({});
      }
      svc.currentProducts = ret;
      $rootScope.$broadcast('category.change');
      return ret;
    },
    initData: function() {
      var cates = ['热餐','餐饮','食品','百货','其他'];
      for(var i = 0; i < 50; i ++) {
        var p = new Product({
          id: i,
          name: '产品名称' + i,
          category: Math.floor(Math.random() * 5),
          price: 1.5 * i,
          unit: '个',
          stock: 20 + i,
          pcode: '1234567890123' + i,
          qcode: '12345678' + i,
          pic: 'box.png',
          desc: '测试产品' + i
        });
        // var pp = Product.$get({'id':'1'});
        // console.log(pp);
        // console.log(pp.name);
        // console.log(pp.id);
        p.save(function(err, result){
          console.log(p._id);
        }, function(err){
          console.log(err);
        });
      }
    }
  };
  return svc;
}]);

/**
 * Cart service
 */
wmApp.service('cartService', ['$rootScope', '$http', function($rootScope, $http) {
  var emptyCart = {
    'products': {},
    'total': {
      'num': 0,
      'amount': 0
    }
  };
  var service = {
    cart: {
      'products': {},
      'total': {
        'num': 0,
        'amount': 0
      }
    },
    add: function(id, name, price) {
      // console.log(id);
      if(service.cart.products[id]) {
        service.cart.products[id].num += 1;
      } else {
        service.cart.products[id] = {};
        service.cart.products[id].name = name;
        service.cart.products[id].num = 1;
        service.cart.products[id].price = price;
      }
      service.cart.total.num += 1;
      service.cart.total.amount += price;
      $rootScope.$broadcast('cart.change');
    },
    empty: function() {
      service.cart = emptyCart;
      $rootScope.$broadcast('cart.change');
    },
    submit: function(contact) {
      var order = service.cart;
      order.contact = contact;
      $http({
        url:'/api/submitOrder',
        method: 'POST',
        data: order}).then(function(response) {
        // var msg = JSON.parse(d);
        if(response.data.status == 200) {
          $rootScope.$broadcast('cart.submit', 'success');
        } else {
          $rootScope.$broadcast('cart.submit', 'fail');
        }
      }, function(response) {
        console.log(response);
      });
    },
    getUserInfo: function(cb) {
      $http.get('/api/getUserInfo').success(function(data) {
        var user = JSON.parse(data);
        cb(user);
      });
    }
  };
  return service;
}]);

/**
 * Orders page controller
 */
wmApp.controller('ordersCtl', ['$scope', '$http', 'Order', function($scope, $http, Order) {
  // Datepicker component initialization
  $('#datepicker').datepicker({
    format: 'yyyy/mm/dd',
    startDate: '-7d'
  }).on('changeDate', function(e) {
    $scope.date = $('#datepicker').datepicker('getDate');
    var reg = $scope.date.Format('yyyyMMdd') + '.*';
    $scope.allOrders = Order.$query({orderid: {$regex: reg}});
    $scope.orders = $scope.allOrders;
  });
  $scope.date = new Date();
  $scope.dateStr = $scope.date.Format('yyyy/MM/dd');
  // $scope.orders = Order.$query({orderid: {$regex: $scope.date.Format('yyyyMMdd') + '.*'}});
  $scope.allOrders = Order.$query({orderid: {$regex: '20161228.*'}});
  $scope.orders = $scope.allOrders;
  $scope.filter = '';
  $scope.filterOrders = function() {
    if($scope.filter != '')
      $scope.orders = _.filter($scope.allOrders, function(o) {
        return o.orderid.toLowerCase().indexOf($scope.filter.toLowerCase()) > -1;
      });
    else $scope.orders = $scope.allOrders;
  };
  $scope.clearFilter = function() {
    $scope.filter = '';
    $scope.filterOrders();
  };
  $scope.getOrderStatus = function(status) {
    var s = '';
    switch(status) {
      case 0: s = '未处理';
      case 1: s = '已确认';
      case 2: s = '已派送';
      case 3: s = '已关闭';
      case -1: s = '已取消';
      default: s = '未处理';
    }
    return s;
  };
}]);
