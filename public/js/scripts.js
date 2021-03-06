app = angular.module("myApp",[]);
app.component("apiForm", {
    template:`
    <div style='background-color:lightgray; padding:20px;'>
        <table>
            <tr>
                <td>Url:</td>
                <td><input type='text' readonly  ng-model='$ctrl.url'/></td>
            </tr>
        <tr>
            <td>Parameters:</td>
            <td>
                <table>
                <tr ng-repeat="param in $ctrl.params">
                    <td>{{param.name}}:</td>
                    <td><input type='text' ng-model='$ctrl.paramValues[param.name]'/></td>
                </tr>
                </table>
            </td>
        </tr>
        </table>
        <table>
            <tr>
                <td ng-if="$ctrl.method=='post' || $ctrl.method == 'put'">
                    <div>Body</div>
                    <textarea ng-model='$ctrl.body' rows=5></textarea>
                </td>
                <td>
                    <div>Response</div>
                    <textarea rows=5>{{$ctrl.response}}</textarea>
                </td>
            </tr>
        </table>
        <button ng-click="$ctrl.fetchAPI()">Test</button>
    </div>
    `,
    controller:function($scope, $http){
        this.response = "";
        this.body = "";
        this.url = "";
        this.method = "";
        this.params = {};
        this.paramValeus = {};

        this.fetchAPI = function(){
            var self = this;
            var url = this.url;
            for (var param in this.paramValues){
                url = url.replace(":"+param, this.paramValues[param])
            }
            if (this.method == "delete"){
                $http.delete(url)
                    .then(function (response){
                        self.response = JSON.stringify(response.data, null, 4);
                    })
                    .catch(function(err){
                        self.response = err;
                    })
            }
            if (this.method == "post") {
                $http.post(url, this.body)
                    .then(function (response){
                        self.response = JSON.stringify(response.data, null, 4);
                    })
                    .catch(function(err){
                        self.response = err;
                    })
            }
            if (this.method == "put"){
                $http.put(url, this.body)
                    .then(function (response){
                        self.response = JSON.stringify(response.data, null, 4);
                    })
                    .catch(function(err){
                        self.response = err;
                    })
            }
            if (this.method == "get") {
                $http.get(url)
                    .then(function (response){
                        self.response = JSON.stringify(response.data, null, 4);
                    })
                    .catch(function(err){
                        self.response = err;
                    })
            }
        }
    },
    bindings: {
        url:"<",
        body:"<",
        method:"<",
        params:"<"
    }
})
app.component("endpointHeader", {
    template:`
    <div class='url {{$ctrl.method}}'>
        <div ng-click="$ctrl.toggle()">
            <span class='method'>{{ $ctrl.method }}</span> 
            {{ $ctrl.url }} 
            <span style='float:right'>{{$ctrl.description}}</span>
        </div>
        <api-form 
        url='$ctrl.url' 
        body="$ctrl.body" 
        method="$ctrl.method" 
        params="$ctrl.params"
        ng-show="$ctrl.visible"
        ></api-form>

    </div>`,
    controller:function myComponent(){
        this.visible = false;
        this.toggle= function(e) {
            this.visible = !this.visible;
        }
    },
    bindings: {
        url: "<",
        description: "<",
        method:"<",
        body:"<",
        params:"<"
    }
})
app.controller("apiTester", function($scope, $http){
    $scope.name = "Richard";
    $scope.config = {};

    $scope.loadData = function(){
        $http.get("http://localhost:5000/config").then(function(response){
            $scope.config = response.data;
        })
    }

    $scope.loadData();
})
