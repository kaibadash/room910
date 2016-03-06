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
    humanSensorDataList: []
  },
  created: function() {
    var self = this;
    var humanSensorDataList = new Array();
    var milkcocoa = new MilkCocoa("blueiks5jeta.mlkcca.com");
    var dataStore = milkcocoa.dataStore("human_sensor")
    dataStore.stream().next(function(err, dataList) {
      console.log("get next data", dataList);
      // Data format:
      // {"id": "XXX","timestamp":1456045078635,"value":"{\"v\":\"1\"}"}
      self.humanSensorDataList = self.humanSensorDataList.concat(dataList.reverse());
    });
    dataStore.on("push", function(data) {
      console.log("new data", data);
      self.humanSensorDataList.unshift(data);
    });
  }
});

