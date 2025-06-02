import React, { useEffect, useState, SyntheticEvent } from "react";
import * as signalR from "@microsoft/signalr";
import CardPortfolio from "../CardPortfolio/CardPortfolio";
import { PortfolioGet } from "../../../Models/Portfolio";

interface Props {
  portfolioValues: PortfolioGet[];
  onPortfolioDelete: (e: SyntheticEvent) => void;
}

const api = "http://localhost:5167";

const ListPortfolio: React.FC<Props> = ({ portfolioValues, onPortfolioDelete }) => {
  const [broadcastMessages, setBroadcastMessages] = useState<string[]>([]);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${api}/portfoliohub`)
      .withAutomaticReconnect()
      .build();

    connection
      .start()
      .then(() => {
        console.log("✅ SignalR Connected");

        connection.on("ReceivePortfolioUpdate", (message: string) => {
          setBroadcastMessages(prev => [message, ...prev]);
        });
      })
      .catch(err => console.error("❌ SignalR Connection Error:", err));

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <section id="portfolio" className="py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
        📁 My Portfolio
      </h2>

      {/* Broadcast Notification */}
      {broadcastMessages.length > 0 && (
        <div className="max-w-4xl mx-auto bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded-md shadow-sm mb-10">
          <h4 className="text-lg font-semibold mb-2 text-yellow-800">📢 Pemberitahuan:</h4>
          <ul className="list-disc list-inside text-sm text-yellow-900 space-y-1">
            {broadcastMessages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Portfolio Cards */}
      <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
        {portfolioValues.length > 0 ? (
          portfolioValues.map((portfolioValue) => (
            <CardPortfolio
              key={portfolioValue.symbol}
              portfolioValue={portfolioValue}
              onPortfolioDelete={onPortfolioDelete}
            />
          ))
        ) : (
          <p className="text-center text-lg text-gray-600">
            🚫 Your portfolio is currently empty.
          </p>
        )}
      </div>
    </section>
  );
};

export default ListPortfolio;
