Vue.filter('datetime', function (unixtime) {
  console.log(unixtime);
  return new Date( unixtime * 1000 )
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
    milkcocoa.dataStore("human_sensor").stream().sort("desc").size(10).next(function(err, dataList) {
      console.log(dataList);
      self.humanSensorDataList = self.humanSensorDataList.concat(dataList);
    });
  }
});

