const api = {
  base: "https://api.openweathermap.org/data/2.5/",
  key: "e1ab9e2911cebbb09f411b553b3df95a",
  urlIpInfo: "https://ipinfo.io",
  keyIpInfo: "cbbaf3253ac37b",
};

function creatTable() {
  $("#example").DataTable({
    searching: false,
    lengthMenu: [
      [3, 2, 5],
      [3, 2, 5],
    ],
    paging: true,
    destroy: true,
    lengthChange: false,
    // data: dataSet
  });
}

function clockUpdate() {
  var date = new Date();

  function addZero(x) {
    if (x < 10) {
      return (x = "0" + x);
    } else {
      return x;
    }
  }

  function twelveHour(x) {
    if (x > 12) {
      return (x = x - 12);
    } else if (x == 0) {
      return (x = 12);
    } else {
      return x;
    }
  }

  var months = new Array(
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  );

  var h = addZero(twelveHour(date.getHours()));
  var m = addZero(date.getMinutes());
  var s = addZero(date.getSeconds());
  var day = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();

  $("#tanggal").text(day + " " + months[month] + " " + year);
  $("#jam").text(h + ":" + m + ":" + s);
}

var city = "";

$(document).ready(function () {
  $(".sembunyi").hide();
  $("#spin").hide();
  clockUpdate();
  setInterval(clockUpdate, 1000);

  $("#btn_cari").click(function () {
    $("#spin").show();
    $(".sembunyi").show();
    city = $("#cari").val();

    var table = $("#example").DataTable();
    table.destroy();
    $("#example").hide();
    $.ajax({
      url:
        api.base + "weather?q=" + city + "&units=metric" + "&appid=" + api.key,
      success: function (res) {
        var temp = res.main.temp;
        var tem_min = res.main.temp_min;
        var tem_max = res.main.temp_max;

        var cond = res.weather[0].main;
        var desc = res.weather[0].description;
        var icon = res.weather[0].icon;

        $("#town").text(res.name);
        $("#img-awan").attr(
          "src",
          "http://openweathermap.org/img/wn/" + icon + "@2x.png"
        );
        $("#cond").text(cond);
        $("#desc").text(desc);
        $("#temp").html(temp.toFixed(0) + "&deg; C");
        $("#tm").html(
          tem_min.toFixed(0) + "&deg; C / " + tem_max.toFixed(0) + "&deg; C"
        );
      },
    });

    $.ajax({
      url:
        api.base + "forecast?q=" + city + "&units=metric" + "&appid=" + api.key,
      success: function (res) {
        // var dataSet = [];
        $("#body").empty();
        for (var i = 0; i < res.list.length; i++) {
          var w = res.list[i];

          //simpan dalam tr
          var tr = $("<tr></tr>");

          // formating tanggal
          var d = new Date(w.dt_txt);
          var month = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Des",
          ];
          var dt =
            d.getUTCDate() +
            " " +
            month[d.getUTCMonth()] +
            " " +
            d.getFullYear();

          // tabel data
          var tag = "";

          // dataSet += w.main.temp_max;
          // icon cuaca dari api
          tag +=
            "<td><img src='http://openweathermap.org/img/wn/" +
            w.weather[0].icon +
            "@2x.png' height='60'></td>";
          tag +=
            "<td><i class='fa fa-calendar-check-o mr-2' aria-hidden='true'></i> <small>" +
            dt +
            "</small><br />" +
            "<i  class='fa fa-clock-o mr-1' aria-hidden='true'></i><small>" +
            w.dt_txt.substring(11, 16) +
            "</small></td>";
          tag +=
            "<td><h5 class='text-warning'>" +
            w.main.temp +
            "°C</h5>" +
            "<small><p>Min: " +
            w.main.temp_min +
            "°C, Max: " +
            w.main.temp_max +
            "°C</p></small></td>";
          tag +=
            "<td><small>" +
            w.weather[0].main +
            "<br />" +
            w.weather[0].description +
            "</small></td>";
          $("#body").append(tr.html(tag));
        }

        creatTable();
        $("#spin").hide();
        $("#example").show();
      },
    });
  });
});
