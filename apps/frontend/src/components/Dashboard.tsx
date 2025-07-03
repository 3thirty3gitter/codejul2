import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, Users, Settings } from "lucide-react";

const stats = [
  { title: "Active Users", value: "1,245", icon: <Users className="w-6 h-6" /> },
  { title: "Tasks Completed", value: "3,870", icon: <BarChart2 className="w-6 h-6" /> },
  { title: "Settings", value: "Customize", icon: <Settings className="w-6 h-6" /> },
];

export default function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="rounded-2xl shadow-md">
            <CardContent className="flex items-center space-x-4 p-6">
              <div className="bg-primary text-white rounded-full p-3">{stat.icon}</div>
              <div>
                <div className="text-2xl font-semibold">{stat.value}</div>
                <div className="text-gray-500">{stat.title}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="bg-white dark:bg-codeblock-50 rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Add User</Button>
          <Button variant="outline">Generate Report</Button>
          <Button variant="secondary">Settings</Button>
        </div>
      </div>
    </div>
  );
}
