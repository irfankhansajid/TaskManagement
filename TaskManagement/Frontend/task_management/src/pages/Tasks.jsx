import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { taskApi } from "@/services/taskApi";
import { Plus,  MoreVertical, Trash, Edit, Check } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,

  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,

} from "@/components/ui/dialog";
import { useToast } from "@/contexts/useToast";

function Tasks() {
  const { toast } = useToast();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getAllTasks();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskApi.updateStatus(taskId, newStatus);

      // Update the task in the local state
      setTasks(
        tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task,
        ),
      );

      toast({
        title: "Status Updated",
        description: `Task status changed to ${newStatus.toLowerCase()}.`,
      });
    } catch (error) {
      console.error("Error updating task status:", error);
      toast({
        title: "Error",
        description: "Failed to update task status.",
        variant: "destructive",
      });
    }
  };

  const confirmDeleteTask = (task) => {
    setTaskToDelete(task);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteTask = async () => {
    if (!taskToDelete) return;

    try {
      await taskApi.deleteTask(taskToDelete.id);
      setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
      toast({
        title: "Task Deleted",
        description: "The task has been permanently deleted.",
      });
    } catch (error) {
      console.error("Error deleting task:", error);
      toast({
        title: "Error",
        description: "Failed to delete task.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

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

  const getFilteredTasks = () => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter.toUpperCase());
  };

  const filteredTasks = getFilteredTasks();

  const renderTableBody = () => {
    if (loading) {
      return [
        <TableRow key="loading">
          <TableCell colSpan={6} className="text-center py-8">
            Loading tasks...
          </TableCell>
        </TableRow>
      ];
    }

    if (filteredTasks.length === 0) {
      return [
        <TableRow key="no-tasks">
          <TableCell colSpan={6} className="text-center py-8">
            No tasks found. Create your first task.
          </TableCell>
        </TableRow>
      ];
    }

    return filteredTasks.map((task) => (
      <TableRow key = {task.id}>
        <TableCell>
          <Link
            to={`/tasks/${task.id}`}
            className="font-medium hover:underline">
            {task.title}
          </Link>
          <p className="text-sm text-gray-500 truncate max-w-xs">
            {task.description}
          </p>
        </TableCell>
        <TableCell>
          {(() => {
            let priorityBadge;
            if (task.priority === "HIGH") {
              priorityBadge = <Badge variant = "destructive">High</Badge>;
            } else if (task.priority === "MEDIUM") {
              priorityBadge = <Badge variant="default">Medium</Badge>;
            } else {
              priorityBadge = <Badge variant="outline">Low</Badge>;
            }
            return priorityBadge;
          })()}
        </TableCell>
        <TableCell>
          {new Date(task.dueDate).toLocaleDateString()}
        </TableCell>
        <TableCell>{getStatusBadge(task.status)}</TableCell>
        <TableCell>{task.assignee?.name || "Unassigned"}</TableCell>
        <TableCell className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button       variant   = "ghost" size = "icon">
              <MoreVertical className = "h-4 w-4" />
                <span className="sr-only">Actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Link to={`/tasks/${task.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Change Status</DropdownMenuLabel>
              <DropdownMenuItem
                onClick = {() => handleStatusChange(task.id, "PENDING")}
                disabled={task.status === "PENDING"}>
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick  = {() => handleStatusChange(task.id, "IN_PROGRESS")}
                disabled = {task.status === "IN_PROGRESS"}>
                In Progress
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusChange(task.id, "REVIEW")}
                disabled={task.status === "REVIEW"}>
                Review
              </DropdownMenuItem>
              <DropdownMenuItem
                       onClick   = {() => handleStatusChange(task.id, "COMPLETED")}
                       disabled  = {task.status === "COMPLETED"}>
                <Check className = "h-4 w-4 mr-2" />
                Complete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => confirmDeleteTask(task)}
                className="text-red-600">
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button asChild>
          <Link to="/tasks/new">
            <Plus className="mr-2 h-4 w-4" /> New Task
          </Link>
        </Button>
      </div>

      {/* Filter controls */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}>
          All
        </Button>
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("pending")}>
          Pending
        </Button>
        <Button
          variant={filter === "in_progress" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("in_progress")}>
          In Progress
        </Button>
        <Button
          variant={filter === "review" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("review")}>
          Review
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("completed")}>
          Completed
        </Button>
      </div>

      {/* Tasks Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {renderTableBody()}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the task "{taskToDelete?.title}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Tasks;
