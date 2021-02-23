import React from "react";

import axios from "axios";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

const Home = () => {
  const [dataWeek, setDataWeek] = useState({
    labels: [],
    datasets: [{ label: "Default", data: [] }],
  });

  const [dataMonth, setDataMonth] = useState({
    labels: [],
    datasets: [{ label: "Default", data: [] }],
  });

  const options = {
    legend: {
      labels: {
        fontColor: "#eee",
      },
    },
    scales: {
      yAxes: [
        {
          gridLines: {
            color: "#eee5",
          },
          ticks: {
            fontColor: "#eee",
          },
        },
      ],
      xAxes: [
        {
          gridLines: {
            color: "#eee5",
          },
          ticks: {
            fontColor: "#eee",
          },
        },
      ],
    },
  };

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://europe-west1-canhub.cloudfunctions.net/get"
      );

      let labelsWeek = [];
      let dataWeek = [];

      for (let obj of response.data.weekly) {
        labelsWeek.push(`${obj._id.year}-${obj._id.month}-${obj._id.week}`);
        dataWeek.push(parseInt(obj.week));
      }

      setDataWeek({
        labels: labelsWeek,
        datasets: [
          {
            label: "Weekly",
            data: dataWeek,
            backgroundColor: "#eee0",
            borderColor: "#eee",
          },
        ],
      });

      let labelsMonth = [];
      let dataMonth = [];

      for (let obj of response.data.monthly) {
        labelsMonth.push(`${obj._id.year}-${obj._id.month}`);
        dataMonth.push(parseInt(obj.week));
      }

      setDataMonth({
        labels: labelsMonth,
        datasets: [
          {
            label: "Monthly",
            data: dataMonth,
            backgroundColor: "#eee0",
            borderColor: "#eee",
          },
        ],
      });
    };

    getData();
  }, []);

  return (
    <div className="main">
      <Line data={dataMonth} options={options} />
      <Line data={dataWeek} options={options} />
    </div>
  );
};

export default Home;
