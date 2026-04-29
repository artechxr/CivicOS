'use client';

import React from "react";
import { Chart } from "react-google-charts";
import { Box, Typography, Paper } from "@mui/material";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ElectionStats() {
  const { t } = useLanguage();

  const data = [
    ["Year", "Voter Turnout %"],
    ["2004", 58.07],
    ["2009", 58.19],
    ["2014", 66.40],
    ["2019", 67.40],
    ["2024", 70.00], // Estimated for demo
  ];

  const options = {
    title: t("Indian General Election Voter Turnout", "भारतीय आम चुनाव मतदान प्रतिशत"),
    curveType: "function",
    legend: { position: "bottom" },
    colors: ["#7EE787"],
    backgroundColor: "transparent",
    chartArea: { width: "80%", height: "70%" },
    hAxis: { title: t("Year", "वर्ष") },
    vAxis: { title: t("Percentage", "प्रतिशत") },
  };

  const timelineData = [
    [
      { type: "string", id: "Phase" },
      { type: "string", id: "Event" },
      { type: "date", id: "Start" },
      { type: "date", id: "End" },
    ],
    ["Preparation", t("Registration Drive", "पंजीकरण अभियान"), new Date(2024, 0, 1), new Date(2024, 2, 1)],
    ["Nomination", t("Filing Papers", "नामांकन दाखिल करना"), new Date(2024, 2, 15), new Date(2024, 3, 1)],
    ["Campaigning", t("Political Rallies", "राजनीतिक रैलियां"), new Date(2024, 3, 1), new Date(2024, 4, 15)],
    ["Polling", t("Phase 1-7", "चरण 1-7"), new Date(2024, 4, 19), new Date(2024, 5, 1)],
    ["Results", t("Counting Day", "गणना का दिन"), new Date(2024, 5, 4), new Date(2024, 5, 5)],
  ];

  const timelineOptions = {
    timeline: { showRowLabels: false },
    colors: ["#7EE787", "#6FE3D6", "#A78BFA", "#F87171", "#FB923C"],
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "white", border: "1px solid rgba(0,0,0,0.05)" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
        {t("Election Insights & Timeline", "चुनाव अंतर्दृष्टि और समयरेखा")}
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Chart
          chartType="LineChart"
          width="100%"
          height="300px"
          data={data}
          options={options}
        />
      </Box>

      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'text.secondary' }}>
        {t("2024 Election Cycle Roadmap", "2024 चुनाव चक्र रोडमैप")}
      </Typography>
      <Box>
        <Chart
          chartType="Timeline"
          data={timelineData}
          width="100%"
          height="200px"
          options={timelineOptions}
        />
      </Box>
    </Paper>
  );
}
