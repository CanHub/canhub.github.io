import React from "react";

import axios from "axios";
import { Line } from "react-chartjs-2";
import { useEffect, useState } from "react";

const defaultGraphOptions = {
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

const defaultDatasetOptions = {
  backgroundColor: "#eee0",
  borderColor: "#eee",
};

const buildDataset = (input, key) => {
  let labels = [];
  let data = [];

  for (let obj of input[key]) {
    const label = Object.values(obj._id).join("-");

    labels.push(label);
    data.push(parseInt(obj.week));
  }

  return {
    labels,
    datasets: [
      {
        label: key,
        data,
        ...defaultDatasetOptions,
      },
    ],
  };
};

const Home = () => {
  const [dataWeek, setDataWeek] = useState({
    labels: [],
    datasets: [{ label: "Default", data: [] }],
  });

  const [dataMonth, setDataMonth] = useState({
    labels: [],
    datasets: [{ label: "Default", data: [] }],
  });

  useEffect(() => {
    const getData = async () => {
      const response = await axios.get(
        "https://europe-west1-canhub.cloudfunctions.net/get"
      );

      const dataWeek = buildDataset(response.data, "weekly");
      setDataWeek(dataWeek);

      const dataMonth = buildDataset(response.data, "monthly");
      setDataMonth(dataMonth);
    };

    getData();
  }, []);

  return (
    <div className="main">
      <Line data={dataMonth} options={defaultGraphOptions} />
      <Line data={dataWeek} options={defaultGraphOptions} />
    </div>
  );
};

export default Home;
