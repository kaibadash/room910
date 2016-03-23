Vue.filter("datetime", function (unixtime) {
  return new Date(unixtime).toLocaleString()
});
Vue.filter("rerativeTime", function (unixtime) {
  var diff = new Date().getTime() - unixtime;
  return Math.floor(diff / 1000);
});

var vue = new Vue({
  el: "#human_sensor_data_list",
  data: {
    using: false,
    humanSensorDataList: [],
    loudnessSensorDataList: []
  },
  created: function() {
    var self = this;
    var humanSensorDataList = new Array();
    var milkcocoa = new MilkCocoa("blueiks5jeta.mlkcca.com");
    var dataStore = milkcocoa.dataStore("human_sensor")
    dataStore.stream().size(3).next(function(err, dataList) {
      console.log("get next data", dataList);
      // Data format:
      // {"id": "XXX","timestamp":1456045078635,"value":"{\"v\":\"1\"}"}
      self.humanSensorDataList = self.humanSensorDataList.concat(dataList.reverse());
      self.using = self.humanSensorDataList[0].value.v == "1";
      setInterval(function() {
        var target = self.humanSensorDataList[0];
        // 描画を更新したいだけなのだが…
        for (data of self.humanSensorDataList) {
            data.timestamp++;
            data.timestamp--;
        }
      }, 10000);
    });
    dataStore.on("push", function(data) {
      self.humanSensorDataList.unshift(data);
      self.using = self.humanSensorDataList[0].value.v == "1";
    });


    // For loudnessSensorDataList.
    var dataStoreLoudness = milkcocoa.dataStore("loudness_state")
    var loudnessSensorDataList = new Array();
    dataStoreLoudness.stream().size(1).next(function(err, dataList) {
      console.log("get next data", dataList);
      // Data format:
      // {"id": "XXX","timestamp":1456045078635,"value":"{\"state\":\"2\"}"}
      self.loudnessSensorDataList = self.loudnessSensorDataList.concat(dataList.reverse());
      setInterval(function() {
        var target = self.loudnessSensorDataList[0];
        // 描画を更新したいだけなのだが…
        for (data of self.loudnessSensorDataList) {
            data.timestamp++;
            data.timestamp--;
        }
      }, 10000);
    });
    dataStoreLoudness.on("push", function(data) {
      self.loudnessSensorDataList.unshift(data);
    });
  }
});
