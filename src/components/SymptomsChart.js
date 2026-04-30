import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

const toDateSafe = (ts) => {
	if (!ts) return null;
	if (ts.toDate) return ts.toDate();
	return new Date(ts);
};

const SymptomsChart = ({ symptoms }) => {
	const trend = useMemo(() => {
		if (symptoms.length < 2) return null;

		const last = parseInt(symptoms[symptoms.length - 1].severity, 10);
		const prev = parseInt(symptoms[symptoms.length - 2].severity, 10);

		if (last > prev) return { text: "Worsening", icon: "🔺", colour: "red" };
		if (last < prev) return { text: "Improving", icon: "🔻", colour: "green" };
		return { text: "Stable", icon: "⏺️", colour: "grey" };
	}, [symptoms]);

	const data = {
		labels: symptoms.map(
			(symptom) => toDateSafe(symptom.date)?.toLocaleDateString() || "",
		),
		datasets: [
			{
				label: "Severity of Symptoms Over Time",
				data: symptoms.map((symptom) => parseInt(symptom.severity, 10)),
				borderColor: "rgba(54, 162, 235, 1)",
				backgroundColor: "rgba(54, 162, 235, 0.25)",
				borderWidth: 3,
				tension: 0.4,
				pointRadius: 5,
				pointHoverRadius: 7,
				pointBackgroundColor: "rgba(54, 162, 235, 1)",
				pointBorderColor: "#fff",
				pointBorderWidth: 2,
			},
		],
	};

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		animation: {
			duration: 900,
			easing: "easeOutQuart",
		},
		scales: {
			y: {
				beginAtZero: true,
				grid: {
					color: "rgba(200, 200, 200, 0.2)",
				},
				ticks: {
					stepSize: 1,
				},
			},
			x: {
				grid: {
					display: false,
				},
			},
		},
		plugins: {
			tooltip: {
				callbacks: {
					label: (ctx) => `Severity: ${ctx.raw}`,
				},
			},
			legend: {
				labels: {
					font: {
						size: 14,
					},
				},
			},
		},
	};

	return (
		<div className="card shadow-sm p-3 mb-4" style={{ height: "360px" }}>
			<div className="d-flex justify-content-between align-items-center mb-2">
				<h5 className="mb-0">Symptoms Trend</h5>
				{trend && (
					<span
						style={{
							fontWeight: 600,
							color: trend.colour,
							fontSize: "0.95rem",
						}}
					>
						{trend.icon} {trend.text}
					</span>
				)}
			</div>
			<Line data={data} options={options} />
		</div>
	);
};

export default SymptomsChart;
