import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const SymptomsChart = ({ symptoms }) => {
	const data = {
		labels: symptoms.map((symptom) =>
			new Date(symptom.date).toLocaleDateString()
		),
		datasets: [
			{
				label: "Severity of Symptoms Over Time",
				data: symptoms.map((symptom) => parseInt(symptom.severity, 10)),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	const options = {
		scales: {
			y: {
				beginAtZero: true,
			},
		},
		maintainAspectRatio: false,
	};

	return (
		<div style={{ height: "300px" }}>
			<Line data={data} options={options} />
		</div>
	);
};

export default SymptomsChart;
