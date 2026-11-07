import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

// "YYYY-MM-DD" is parsed as UTC by Date(); build a local date to avoid off-by-one labels.
const formatDate = (isoDate) => {
	const [y, m, d] = String(isoDate).split("-").map(Number);
	return y && m && d ? new Date(y, m - 1, d).toLocaleDateString() : isoDate;
};

const options = {
	scales: {
		y: { beginAtZero: true, suggestedMax: 10, ticks: { stepSize: 1 } },
	},
	spanGaps: true,
	maintainAspectRatio: false,
};

const SymptomsChart = ({ symptoms }) => {
	const sorted = [...symptoms].sort((a, b) => String(a.date).localeCompare(String(b.date)));
	const data = {
		labels: sorted.map((s) => formatDate(s.date)),
		datasets: [
			{
				label: "Severity of Symptoms Over Time",
				// Missing severity becomes a gap instead of NaN.
				data: sorted.map((s) => {
					const n = Number(s.severity);
					return s.severity === "" || s.severity == null || Number.isNaN(n) ? null : n;
				}),
				borderColor: "rgb(255, 99, 132)",
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};

	return (
		<div style={{ height: "300px" }}>
			<Line data={data} options={options} />
		</div>
	);
};

export default SymptomsChart;
