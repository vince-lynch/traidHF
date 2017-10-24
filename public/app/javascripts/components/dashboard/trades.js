const assetTrades = {
  template:`
<div class="content">
<div class="container-fluid">
    <div class="row">
        <div class="col-md-12">


            <div class="card">           
                <div class="header">
                    <h4 class="title"><span>{{search._assetTkn}}</span><i class="ti-pulse"></i>
                        <div style="float: right;">
                            <select ng-model="search._assetTkn" ng-change="generateChartForSymbol(search._assetTkn)"class="form-control" style="    height: 32px;">
                              <option value="AMZN">AMZN</option>
                              <option value="TSLA">TSLA</option>
                              <option value="GOOGL">GOOGL</option>
                              <option value="FB">FB</option>
                              <option value="APPL">APPL</option>
                            </select>
                            <!-- <input type="text" ng-model="search._assetTkn" style="display: none;"> -->
                        </div>
                    </h4>
                    <p class="category">Live charts</p>
                </div>
                
                <div id="chartdiv" style="width:100%; height:500px;"> 
                </div>           
                
            </div>
            <div class="card">
                <div class="header">
                    <h4 class="title"><span>{{search._assetTkn}}</span>
                        <div style="float: right;">
                            <select ng-model="search._assetTkn" ng-change="generateChartForSymbol(search._assetTkn)"class="form-control" style="height: 32px;">
                              <option value="AMZN">AMZN</option>
                              <option value="TSLA">TSLA</option>
                              <option value="GOOGL">GOOGL</option>
                              <option value="FB">FB</option>
                              <option value="APPL">APPL</option>
                            </select>
                            <!-- <input type="text" ng-model="search._assetTkn" style="display: none;"> -->
                        </div>
                    </h4>
                    <p class="category">Your transactions with our virtualised {{search._assetTkn}}Tokens</p>
                </div>
                <div class="content table-responsive table-full-width">
                    <table class="table table-striped">
                        <thead>
                            <th>When</th>
                        	<th>Action</th>
                        	<th>Asset</th>
                        	<th>Amount</th>
                        	<th>Shares</th>
                            <th>Credits</th>
                        </thead>
                        <tbody>
                            <tr ng-repeat="trade in allTrades | filter:search">
                            	<td>
                                    <span ng-if="trade.tradeTransaction.time == undefined">{{trade._now}}</span>
                                    <span ng-if="trade.tradeTransaction.time != undefined">{{trade.tradeTransaction.time}}</span>
                                </td>
                            	<td>{{trade._BuyOrSell}}</td>
                            	<td>{{trade._assetTkn}}</td>
                            	<td>{{trade._amount}}</td>
                            	<td>
                                    <span ng-if="trade.tradeTransaction.time == undefined">(not processed yet) 
                                    <i class="fa fa-info-circle" aria-hidden="true"  data-toggle="tooltip" title="Transactions to NYSE are usually picked up within 2-3 minutes, unless the Stock Exchange is closed for evening, weekends or holidays. Transaction will process when market re-opens"></i>
                                    </span>
                                    {{trade.tradeTransaction.shares}}
                                </td>
                                <td>
                                    <span ng-if="trade._ledger > 0" style="color: green;"> +{{trade._ledger}}</span>
                                    <span ng-if="trade._ledger == 0"> {{trade._ledger}}</span>
                                    <span ng-if="trade._ledger < 0" style="color: red;"> {{trade._ledger}}</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
            </div>

            <div class="card">           
                <div class="header">
                    <h4 class="title">
                        <span>Buy & Sell</span>
                    </h4>
                    <p class="category">
                        <span>{{search._assetTkn}} Tokens</span>
                    </p>
                </div>
                <div class="content table-responsive table-full-width">
                    <table class="table table-striped">
                        <thead>
                            <th>Amount</th>
                            <th>When</th>
                            <th>Buy</th>
                            <th>Sell</th>
                        </thead>
                        <tbody>
                            <tr>
                                <td><input type="text" ng-model="tradeAmount" class="form-control"/></td>
                                <td>Now</td>
                                <td>
                                    <button 
                                    ng-click="buyAsset(search._assetTkn, tradeAmount)"
                                    class="btn"
                                    >Buy</button>
                                </td>
                                <td>
                                    <button 
                                        ng-click="sellAsset(search._assetTkn, tradeAmount)"
                                        class="btn"
                                    >Sell</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>

    </div>
</div>
`,
  controller($scope, $http) {

    $scope.makeNotification = function(text, symbol, amount, buyOrSell){
        $.notify({
            icon: 'ti-gift',
            message: "Your " + buyOrSell + " order of " + symbol + " has been placed"
        },{
            type: 'success',
            timer: 4000
        });     
    }


    /**
    GET ALL TRADES for WALLET ADDRESS
    **/
    $http({method: 'GET',url: '/api/allTrades/' + window.myaccounts[0]})
    .then(function successCallback(response) {
      console.log('success Response', response);
      $scope.allTrades = response.data.trades;
      $scope.numTrades = response.data.numTrades;
    }, function errorCallback(response) {
        console.log('error Response', response);
    });



    $scope.sellAsset = function(_assetTkn, _amount) {
      window.Cryptoah.deployed().then(function(contractInstance) {
        contractInstance.sellAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
          contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
            makeNotification('', _assetTkn, _amount, 'SELL');
            console.log('Now holding ', v, "of " + _assetTkn);
          });
        });
      });
    }

    $scope.buyAsset = function(_assetTkn, _amount) {
      window.Cryptoah.deployed().then(function(contractInstance) {
        contractInstance.holdAsset(_assetTkn, _amount, {gas: 140000, from: web3.eth.accounts[0]}).then(function(v) {
          contractInstance.checkHoldingAsset.call(_assetTkn).then(function(v) {
            makeNotification('', _assetTkn, _amount, 'BUY');
            console.log('Now holding ', v, "of " + _assetTkn);
          });
        });
      });
    }


    var chartData;
    var stockData = {};
    $scope.search = {_assetTkn: 'AMZN'};

    $scope.generateChartForSymbol = function(symbol){

        $http({method: 'GET',url: '/api/stockHistory/' + symbol})
        .then(function successCallback(response) {
          console.log('success Response', response);
          
          stockData[symbol] = response.data.data;
          
          chartData = generateChartData(stockData[symbol]);
          $scope.makeChart();

        }, function errorCallback(response) {
            console.log('error Response', response);
        });
    }

    function generateChartData(stockD) {
      var chartData = [];
      var firstDate = new Date( stockD[0].time );
      firstDate.setDate( firstDate.getDate() - 1000 );
      firstDate.setHours( 0, 0, 0, 0 );

      for ( var i = 0; i < stockD.length; i++ ) {
        var newDate = new Date( stockD[i].time );

        var a = stockD[i].close;
        var b = stockD[i].volume;

        chartData.push( {
          date: newDate,
          value: a,
          volume: b
        } );
      }
      return chartData;
    }


    $scope.makeChart = function(){
        var chart = AmCharts.makeChart( "chartdiv", {

          type: "stock",
          "theme": "light",
                           
          categoryAxesSettings: {
            minPeriod: "mm"
          },

          dataSets: [ {
            color: "#b0de09",
            fieldMappings: [ {
              fromField: "value",
              toField: "value"
            }, {
              fromField: "volume",
              toField: "volume"
            } ],

            dataProvider: chartData,
            categoryField: "date"
          } ],


          panels: [ {
              showCategoryAxis: true,
              title: "Value",
              percentHeight: 70,

              stockGraphs: [ {
                id: "g1",
                valueField: "value",
                type: "smoothedLine",
                lineThickness: 2,
                bullet: "round"
              } ],


              stockLegend: {
                valueTextRegular: " ",
                markerType: "none"
              }
            },

            {
              title: "Volume",
              percentHeight: 30,
              stockGraphs: [ {
                valueField: "volume",
                type: "column",
                cornerRadiusTop: 2,
                fillAlphas: 1
              } ],

              stockLegend: {
                valueTextRegular: " ",
                markerType: "none"
              }
            }
          ],

          chartScrollbarSettings: {
            graph: "g1",
            usePeriod: "10mm",
            position: "top"
          },

          chartCursorSettings: {
            valueBalloonsEnabled: true
          },

          periodSelector: {
            position: "top",
            dateFormat: "YYYY-MM-DD JJ:NN",
            inputFieldWidth: 150,
            periods: [ {
              period: "hh",
              count: 1,
              label: "1 hour",
              selected: true

            }, {
              period: "hh",
              count: 2,
              label: "2 hours"
            }, {
              period: "hh",
              count: 5,
              label: "5 hour"
            }, {
              period: "hh",
              count: 12,
              label: "12 hours"
            }, {
              period: "MAX",
              label: "MAX"
            } ]
          },

          panelsSettings: {
            usePrefixes: true
          },

          "export": {
            "enabled": true,
            "position": "bottom-right"
          }
        } );

    } // end of chart

    $scope.generateChartForSymbol($scope.search._assetTkn);

    }
};

export default assetTrades;