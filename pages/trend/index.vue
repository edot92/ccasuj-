<template>
  <div>
    <v-layout row wrap>
      <v-flex xs6 sm12>
        <canvas id="chartBrix"></canvas>
      </v-flex>
      <v-flex xs6 sm12>
        <canvas id="chartFlow"></canvas>
      </v-flex>
    </v-layout>
  </div>
</template>

<script>
  import Chart from "chart.js";
  import axios from 'axios'
  import moment from 'moment'
  // import io from 'socket.io-client';
  var socket
  export default {
    data() {
      return {};
    },
    beforeCreate() {

    },
    destroyed() {

    },
    mounted() {
      socket = window.io(this.$store.state.serverWs);
      $.notify.defaults({
        autoHideDelay: 1000,
      })
      const thisV = this
      this.initChart1();
      this.initChart2();
      // this.initSocket();
      thisV.getTrendFromServer()
    },
    methods: {
      getTrendFromServer() {
        const thisV = this
        axios({
          url: '/mesin/trend/10',
          method: 'get'
        }).then(res => {
          if (res.data.length > 0) {
            const data = res.data
            var valBrixArray = []
            var timeBrixArray = []
            var tempvalBrixArray = []
            var temptimeBrixArray = []

            var valFlowArray = []
            var timeFlowArray = []
            var tempvalFlowArray = []
            data.forEach(element => {
              tempvalBrixArray.push(element.brix)
              tempvalFlowArray.push(element.flow)
              let tempWaktu = moment(element.timestamp).format(
                "DD-MM-YYYY HH:mm:ss"
              )
              temptimeBrixArray.push(tempWaktu)
            });
            valBrixArray = tempvalBrixArray.reverse()
            timeBrixArray = temptimeBrixArray.reverse()
            valFlowArray = tempvalFlowArray.reverse()
            $(document).trigger("update_chartBrix", [valBrixArray, timeBrixArray])
            $(document).trigger("update_chartFlow", [valFlowArray, timeBrixArray])
            setTimeout(() => {
              thisV.getTrendFromServer()
            }, 2000)
          }
        }).catch(err => {
          console.error(err)
          setTimeout(() => {
            thisV.getTrendFromServer()
          }, 2000)
        })
      },
      initChart1() {
        var ctx = document.getElementById("chartBrix");
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: [], //timestamp
            datasets: [{
              label: "#Brix",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        $(document).on("update_chartBrix", function (e, valArray, timeArray) {
          $.notify("updated brix");
          // myChart.data.labels = []
          myChart.data.labels = (timeArray);
          // myChart.data.datasets[0].data = []
          myChart.data.datasets[0].data = valArray
          console.log(myChart.data.datasets)
          myChart.update();
        })
      },
      initChart2() {
        var ctx = document.getElementById("chartFlow");
        var myChart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
            datasets: [{
              label: "#Flow",
              data: [],
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)"
              ],
              borderColor: [
                "rgba(255,99,132,1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)"
              ],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              yAxes: [{
                ticks: {
                  beginAtZero: true
                }
              }]
            }
          }
        });
        $(document).on("update_chartFlow", function (e, valArray, timeArray) {
          $.notify("updated flow");
          myChart.data.labels = (timeArray);
          myChart.data.datasets[0].data = valArray
          console.log(myChart.data.datasets)
          myChart.update();
        })
      },
      initSocket() {
        // socket.on('connect', function () {
        //   console.log("connect")
        // });
        // socket.on('trendupdate', function (data) {
        //   console.log(data)
        //   thisV.getTrendFromServer()

        // });
        // socket.on('disconnect', function () {
        //   console.log("disconnect")

        // });
      }
    }
  };
</script>