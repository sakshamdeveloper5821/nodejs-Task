import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar  } from 'react-chartjs-2';
import { saveAs } from 'file-saver'; 

import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend ,zoomPlugin);

const options: any = {
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: 'right',
    },
    title: {
      display: true,
      text: 'Chart.js Horizontal Bar Chart',
    },
    zoom: {
      zoom: {
        wheel: {
          enabled: true // SET SCROOL ZOOM TO TRUE
        },
        mode: "xy",
        speed: 100
      },
      pan: {
        enabled: true,
        mode: "xy",
        speed: 100
      }
    },
    pan: {
      enabled: true,
      mode: 'xy',
    },
  },
};

const Horizontalchart: React.FC = () => {
  const [data, setData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
    }[];
  }>({
    labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(25, 90, 13, 0.5)',
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      const url = 'http://localhost:5000/v1/data';
      const dataSet1: number[] = [];
      try {
        const response = await fetch(url);
        const res = await response.json();
        console.log('API data', res);
        for (const val of res) {
          dataSet1.push(val.value);
        }
        setData({
          labels: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          datasets: [
            {
              label: 'Dataset ID',
              data: dataSet1,
              borderColor: 'rgb(255, 99, 132)',
              backgroundColor: 'rgba(99, 132, 0.5)',
            },
          ],
        });
      } catch (error) {
        console.log('error', error);
      }
    };

    fetchData();
  }, []);

  const handleExportCSV = () => {
    const csvContent = [
      ['Day', 'Value'],
      ...data.labels.map((day, index) => [day, data.datasets[0].data[index]])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'chart_data.csv');
  };

  return (
    <div style={{ width: '80%', height: '90%' }}>
      <Bar data={data} options={options} />
      <button
        onClick={handleExportCSV}
        style={{
          padding: '8px 16px',
          background: 'white',
          color: 'black',
          border: '2px solid green',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '20px',
        }}
      >
        Export CSV
      </button>
    </div>
  );
};

export default Horizontalchart;




