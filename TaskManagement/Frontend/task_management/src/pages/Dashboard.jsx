import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { taskApi } from "@/services/taskApi";
import { projectApi } from "@/services/projectApi";

function Dashboard() {
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    totalProjects: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

          // fetch all tasks
        const tasks = await taskApi.getAllTasks();

          // fetch all projects
        const projects = await projectApi.getAllProject();

        // calculate stats
        const completedTasks = tasks.filter(
          (task) => task.status === "COMPLETED",
        );
        const pendingTasks = tasks.filter((task) => task.status === "PENDING");
        // filter in-progress tasks
        const inProgressTasks = tasks.filter(
          (task) => task.status === "IN_PROGRESS",
        );

        // calculate overdue tasks 
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const overdueTasks = tasks.filter((task) => {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate < today && task.status !== "COMPLETED";
        });

        // set stats
        setStats({
          totalTasks    : tasks.length,
          completedTasks: completedTasks.length,
          pendingTasks  : pendingTasks.length,
          overdueTasks  : overdueTasks.length,
          totalProjects : projects.length,
          inProgressTasks: inProgressTasks.length
        });

        // Sort tasks by creation date (newest first) and get the 5 most recent
        const sortedTasks = [...tasks]
          .sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
          })
          .slice(0, 5);

        setRecentTasks(sortedTasks);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

    // calculate completion rate
  
  const completionRate =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  // Get status badge style
  const getStatusBadge = (status) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            {status}
          </Badge>
        );
      case "IN_PROGRESS":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
            {status}
          </Badge>
        );
      case "REVIEW":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            {status}
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">
            {status}
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <Button asChild>
          <Link to="/tasks/new">Create New Task</Link>
        </Button>
      </div>

      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Tasks
            </CardTitle>
            <div className="p-1 bg-gray-100 rounded-md">
              <Briefcase className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalTasks}</div>
            <p className="text-xs text-gray-500 mt-1">In your system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Completed
            </CardTitle>
            <div className="p-1 bg-green-100 rounded-md">
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {stats.completedTasks}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {completionRate}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Pending
            </CardTitle>
            <div className="p-1 bg-blue-100 rounded-md">
              <Clock className="h-4 w-4 text-blue-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {stats.pendingTasks}
            </div>
            <p className="text-xs text-gray-500 mt-1">Waiting to be started</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Overdue
            </CardTitle>
            <div className="p-1 bg-red-100 rounded-md">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {stats.overdueTasks}
            </div>
            <p className="text-xs text-gray-500 mt-1">Tasks past due date</p>
          </CardContent>
        </Card>

        
      </div>

      {/* Recent Tasks & Progress */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Tasks */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Tasks</CardTitle>
              <CardDescription>
                Your most recently created tasks
              </CardDescription>
            </div>
            <Link to="/tasks" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentTasks.length > 0 ? (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="space-y-1">
                      <Link
                        to={`/tasks/${task.id}`}
                        className="font-medium hover:underline">
                        {task.title}
                      </Link>
                      <p className="text-sm text-gray-500">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(task.status)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                No tasks found. Create your first task.
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/tasks">
                View All Tasks <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>

        {/* Project Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>
              Task and project completion status
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Task Completion Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Task Completion</span>
                <span>{completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-green-600 h-2.5 rounded-full"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{stats.completedTasks} completed</span>
                <span>{stats.totalTasks - stats.completedTasks} remaining</span>
              </div>
            </div>

            {/* Project Status */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Projects</span>
                <span>{stats.totalProjects} total</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="p-2 bg-blue-100 rounded-md">
                  <Briefcase className="h-4 w-4 text-blue-600" />
                </div>
                <div className="text-sm">
                  You have{" "}
                  <span className="font-medium">{stats.totalProjects}</span>{" "}
                  active projects
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/projects">
                Manage Projects <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
