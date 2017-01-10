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
        .state('realtime', {
            url: '/realtime',
            views: {
              '': {
                templateUrl: 'views/realtime.html',
                controller: 'realtimeCtl'
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
  $scope.categories = config.CATEGORIES;
  $scope.category = $scope.categories[0];
  $scope.subcat = $scope.category.subcat[0];
  // productService.loadProduct($scope.category.code);

  $scope.changeCategory = function(cate) {
    if(cate.length === 2) {
      $scope.category = _.find($scope.categories, function(item) { return item.code === cate; });
      $scope.subcat = $scope.category.subcat[0];  // restore sub category to ALL
    } else {
      var c = cate.substring(0, 2);
      var l1 = _.find($scope.categories, function(item) { return item.code === c; });
      $scope.subcat = _.find(l1.subcat, function(item) { return item.code === cate; });
      if(cate.substring(2) === '00') { // xx00, load all products in main category
        productService.loadProduct(c);
        return;
      }
    }
    productService.loadProduct(cate);
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

  // $scope.products = Product.$query({});
  $scope.products = productService.loadProduct('01');

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
  $scope.submitted = false;
  $scope.timeSlots = [];
  $scope.schedule = '';
  $scope.mobile = '';
  $scope.address = '';
  $scope.comment = '';
  // get user info from server
  $http.get('/api/getUserInfo').success(function(data) {
    // console.log(data);
    // var user = JSON.parse(data);
    var user = data;
    // console.log(user);
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

  // calculate shcedule time slots
  var now = new Date();
  var h = now.getHours();
  var m = now.getMinutes();
  var max = h + 8;
  for(var i = h; i < max; i ++) {
    var hh = i % 24;
    var next = (i + 1) % 24;
    $scope.timeSlots.push(hh + ':00 - ' + hh + ':30');
    $scope.timeSlots.push(hh + ':30 - ' + next + ':00');
  }
  if(m >= 30) {
    $scope.timeSlots.shift();
  }
  $scope.schedule = $scope.timeSlots[0];

  //
  $scope.cart = cartService.cart;
  $scope.$on('cart.change', function(event){
    $scope.cart = cartService.cart;
    $scope.submitted = false;
    // console.log($scope.cart);
  });
  $scope.$on('cart.submit', function(event, data) {
    if(data === 'success') {
      $scope.tips('success', '您的订单已经确认！货到付款。因可能存在促销降价、缺换货等情况，实际结算金额以收银小票为准。');
      $scope.submitted = true;
    } else {
      $scope.tips('fail', '抱歉，您的订单提交发生错误，请稍后再试或电话与我们联系，85856735。');
    }
  });

  $scope.clearMobile = function() {
    // console.log('clear mobile');
    $scope.mobile = '';
  };

  $scope.clearAddress = function() {
    // console.log('clear address');
    $scope.address = '';
  };
  $scope.clearComment = function() {
    // console.log('clear comment');
    $scope.comment = '';
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

  $scope.isEmpty = function() {
    // console.log($scope.cart.products);
    for(var k in $scope.cart.products) {
      if($scope.cart.products.hasOwnProperty(k)) {
            return false;
      }
    }
    return true;
  }

  $scope.remove = function(id) {
    cartService.remove(id);
  };

  $scope.decrease = function(id) {
    cartService.change(id, -1);
  };

  $scope.increase = function(id) {
    cartService.change(id, 1);
  };

  $scope.submitCart = function() {
    // console.log('cart submit');
    $scope.hideTips();
    if($scope.cart.total.amount < 30) {// total amount less than 30, stop
      $scope.tips('fail', '全时外送满30元起送，外送费5元，满58元免外送费。');
    } else {// more than 30
      var contact = {};
      contact.mobile = $scope.mobile;
      contact.address = $scope.address;
      contact.schedule = $scope.schedule;
      contact.comment = $scope.comment;
      // console.log(contact);
      if(contact.mobile == undefined || contact.mobile == ''
        || contact.address == undefined || contact.address == '') {
        $scope.tips('fail', '请填写正确的移动联系电话和外送地址信息！');
        return;
      }
      // less than 58?
      var flag = $scope.cart.total.amount < 58;
      cartService.submit(contact, flag);
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
      // console.log('load category: ', cat);
      var ret = {};
      if(cat.length == 2) {
        ret = Product.$query({'category': cat});
      } else {
        ret = Product.$query({'subcat': cat});
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
    recalculate: function() {
      // console.log(service.cart);
      var num = 0, amount = 0;
      for(var p in service.cart.products) {
        var pp = service.cart.products[p];
        num += pp.num;
        amount += pp.num * pp.price;
      }
      service.cart.total.num = num;
      service.cart.total.amount = amount;
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
    remove: function(id) {
      // service.cart.products[id] = undefined;
      delete service.cart.products[id];
      service.recalculate();
      $rootScope.$broadcast('cart.change');
    },
    change: function(id, num) {
      var n = service.cart.products[id].num;
      if((n + num) < 1) return;
      service.cart.products[id].num += num;
      service.recalculate();
      $rootScope.$broadcast('cart.change');
    },
    submit: function(contact, flag) {
      // console.log(contact);
      var order = service.cart;
      if(flag) {// less than 58
        order.total.amount += 5;
      }
      order.schedule = contact.schedule;
      order.comment = contact.comment;
      delete contact.schedule;
      delete contact.comment;
      order.contact = contact;
      // console.log(order);
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
    $('#datepicker').datepicker('hide');
  });
  $scope.date = new Date();
  $scope.dateStr = $scope.date.Format('yyyy/MM/dd');
  $scope.orders = Order.$query({orderid: {$regex: $scope.date.Format('yyyyMMdd') + '.*'}});
  // $scope.allOrders = Order.$query({orderid: {$regex: '20161228.*'}});
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
      case 0: s = '未处理'; break;
      case 1: s = '已确认'; break;
      case 2: s = '已派送'; break;
      case 3: s = '已结单'; break;
      case -1: s = '已取消'; break;
      default: s = '未处理';
    }
    return s;
  };
  $scope.convDateString = function(short) {
    if(short == undefined || short.length != 14)
      return short
    return short.substring(0,4) + '-' + short.substring(4,6) + '-' + short.substring(6,8)
      + ' ' + short.substring(8,10) + ':' + short.substring(10,12) + ':' + short.substring(12);
  };
}]);

/**
 * Realtime order page controller
 */
wmApp.controller('realtimeCtl', ['$scope', '$http', 'Order', function($scope, $http, Order) {
  var url = 'ws://' + config.STOMP_HOST + ':' + config.STOMP_PORT + '/stomp';
  // var ws = new SockJS(url);
  // var client = Stomp.over(ws);
  config.client = Stomp.client(url);
  // config.client = Stomp.over(ws);
  config.client.connect(config.STOMP_USER, config.STOMP_PASSWD, ()=>{
    console.log('stomp connected.');
    try {
      config.subscription = config.client.subscribe(config.STOMP_TOPIC, function (message) {
        // console.log(message);
        var order = JSON.parse(message.body);
        var o = new Order(order);
        $scope.orders.push(o);
        // console.log($scope.orders);
        $scope.$apply();
        $scope.playNotice();
      }, function (err) {
        console.log(err);
      }, {'activemq.retroactive':true});
    } catch(e) {
      console.log(e);
    }
  }, (err)=>{console.log(err);});

  var now = new Date()
  var ms = now.getTime();
  ms -= 12 * 60 * 60 * 1000;
  now.setTime(ms);
  var t = now.Format('yyyyMMddhhmmss');
  $scope.orders = Order.$query({submittime: {$gt: t }});

  $scope.confirm = function(id) {
    var o = _.find($scope.orders, function(item) { return item.orderid === id; });
    o.status = 1;
    $scope.sendStatus(o);
  };

  $scope.sendout = function(id) {
    var o = _.find($scope.orders, function(item) { return item.orderid === id; });
    o.status = 2;
    $scope.sendStatus(o);
  };

  $scope.close = function(id) {
    var o = _.find($scope.orders, function(item) { return item.orderid === id; });
    o.status = 3;
    $scope.sendStatus(o);
  };

  $scope.cancel = function(id) {
    var o = _.find($scope.orders, function(item) { return item.orderid === id; });
    o.status = -1;
    $scope.sendStatus(o);
  };

  $scope.sendStatus = function(order) {
    order.save((err) => {
      if(err)
        console.log(err);
      else console.log('Order status changed.');
    });
  };

  $scope.getOrderStatus = function(status) {
    var s = '';
    switch(status) {
      case 0: s = '未处理'; break;
      case 1: s = '已确认'; break;
      case 2: s = '已派送'; break;
      case 3: s = '已结单'; break;
      case -1: s = '已取消'; break;
      default: s = '未处理';
    }
    return s;
  };

  $scope.convDateString = function(short) {
    if(short == undefined || short.length != 14)
      return short
    return short.substring(8,10) + ':' + short.substring(10,12) + ':' + short.substring(12);
  };

  $scope.playNotice = function() {
    var audio = document.createElement("audio");
    audio.src = config.NOTICE_AUDIO;
    audio.autoplay = "autoplay";
    audio.addEventListener("canplay", function() {
      audio.play();
    });
    audio.play();
    // var audio = $('#notice')[0];
    // audio.play();
  };

  $scope.$on('$destroy', function(event) {
    console.log('realtime scope destroyed.');
    config.subscription.unsubscribe();
    config.client.disconnect((err)=>{ console.log(err); });
    // alert('realtime scope destroyed.');
  });

}]);
