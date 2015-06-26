'use strict';

angular.module('bmw1App')
  .controller('AssettreeCtrl', function ($scope,$http,socket) {
    $scope.assets = [];

    $http.get('/api/assets').success(function(assets) {
      $scope.assets = assets;
      console.log(assets);
      console.log('Success');
      //socket.syncUpdates('asset', $scope.assets);
    }).
    error(function(data, status, headers, config) {
      console.log('Failure');

    // called asynchronously if an error occurs
    // or server returns response with an error status.
    });

    //Add snap button functions for treeview side panel
    var snapper = new Snap({
       element: document.getElementById('content')
    });
    var snapperNavBar = new Snap({
       element: document.getElementById('navbar')
    });

    addEvent(document.getElementById('open-left'), 'click', function(){
      snapper.open('left');
    });
    console.log('Controller Loaded');
    //console.log($scope.assets);      
  });
  
var addEvent = function addEvent(element, eventName, func) {
  if (element.addEventListener) {
      return element.addEventListener(eventName, func, false);
    } else if (element.attachEvent) {
        return element.attachEvent("on" + eventName, func);
    }
};

/* Prevent Safari opening links when viewing as a Mobile App */
(function (a, b, c) {
    if(c in b && b[c]) {
        var d, e = a.location,
            f = /^(a|html)$/i;
        a.addEventListener("click", function (a) {
            d = a.target;
            while(!f.test(d.nodeName)) d = d.parentNode;
            "href" in d && (d.href.indexOf("http") || ~d.href.indexOf(e.host)) && (a.preventDefault(), e.href = d.href)
        }, !1)
    }
})(document, window.navigator, "standalone");