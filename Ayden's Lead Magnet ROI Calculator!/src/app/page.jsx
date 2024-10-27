"use client";
import React from "react";

function MainComponent() {
  const [customerValue, setCustomerValue] = React.useState(5000);
  const [siteTraffic, setSiteTraffic] = React.useState(1000);
  const [demoRate, setDemoRate] = React.useState(2);
  const [leadRate, setLeadRate] = React.useState(10);
  const [leadToDemo, setLeadToDemo] = React.useState(5);

  const directDemos = siteTraffic * (demoRate / 100);
  const leadDownloads = siteTraffic * (leadRate / 100);
  const leadDemos = leadDownloads * (leadToDemo / 100);
  const totalDemos = directDemos + leadDemos;

  return (
    <div className="min-h-screen bg-white p-8 font-inter">
      <h1 className="text-4xl md:text-5xl text-center font-bold text-neutral-800 mb-12">
        ROI Calculator
      </h1>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h3 className="text-neutral-700 font-semibold mb-2">
              Customer Value ($)
            </h3>
            <input
              type="number"
              name="customerValue"
              value={customerValue}
              onChange={(e) => setCustomerValue(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded"
            />
          </div>

          <div>
            <h3 className="text-neutral-700 font-semibold mb-2">
              Monthly Site Traffic
            </h3>
            <input
              type="number"
              name="siteTraffic"
              value={siteTraffic}
              onChange={(e) => setSiteTraffic(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded"
            />
          </div>

          <div>
            <h3 className="text-neutral-700 font-semibold mb-2">
              Demo Conversion Rate (%)
            </h3>
            <input
              type="number"
              name="demoRate"
              value={demoRate}
              onChange={(e) => setDemoRate(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded"
            />
          </div>

          <div>
            <h3 className="text-neutral-700 font-semibold mb-2">
              Lead Magnet Conversion Rate (%)
            </h3>
            <input
              type="number"
              name="leadRate"
              value={leadRate}
              onChange={(e) => setLeadRate(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded"
            />
          </div>

          <div>
            <h3 className="text-neutral-700 font-semibold mb-2">
              Lead Magnet to Demo Rate (%)
            </h3>
            <input
              type="number"
              name="leadToDemo"
              value={leadToDemo}
              onChange={(e) => setLeadToDemo(e.target.value)}
              className="w-full p-3 border border-neutral-300 rounded"
            />
          </div>
        </div>

        <div className="bg-neutral-50 p-8 rounded-lg shadow-sm flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <h3 className="text-neutral-700 font-semibold mb-2">
                Monthly Direct Demos
              </h3>
              <p className="text-2xl font-bold text-neutral-800">
                {directDemos.toFixed(0)}
              </p>
            </div>

            <div>
              <h3 className="text-neutral-700 font-semibold mb-2">
                Lead Magnet Downloads
              </h3>
              <p className="text-2xl font-bold text-neutral-800">
                {leadDownloads.toFixed(0)}
              </p>
            </div>

            <div>
              <h3 className="text-neutral-700 font-semibold mb-2">
                Demos from Lead Magnets
              </h3>
              <p className="text-2xl font-bold text-neutral-800">
                {leadDemos.toFixed(0)}
              </p>
            </div>

            <div className="pt-4 border-t border-neutral-200">
              <h3 className="text-neutral-700 font-semibold mb-2">
                Total Monthly Demos
              </h3>
              <p className="text-3xl font-bold text-neutral-800">
                {totalDemos.toFixed(0)}
              </p>
            </div>
          </div>

          <button className="w-full mt-8 bg-neutral-800 text-white py-3 px-6 rounded font-semibold hover:bg-neutral-700 transition-colors">
            Book a consultation →
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;